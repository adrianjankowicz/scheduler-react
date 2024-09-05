import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
  ChangeSet,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  ConfirmationDialog,
  DragDropProvider,
  DayView,
  MonthView,
  DateNavigator,
  Toolbar,
  TodayButton,
  // ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "./Header";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import updateLocale from "dayjs/plugin/updateLocale";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  where,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

import dayjs from "dayjs";
import pl from "dayjs/locale/pl";

import BasicLayout from "./BasicLayout";
import { AppointmentModel } from "../types/types";
import CustomViewSwitcher from "./CustomViewSwitcher";
import { DraftAppointment, SourceAppointment } from "./DragDropProvider";
import appointmentColors from "../utils/colors";
import CustomDateEditor from "./CustomDateEditor";

dayjs.locale("pl");
dayjs.extend(updateLocale);

dayjs.updateLocale("pl", {
  weekStart: 1,
});

const KEYBOARD_KEY = "Shift";

const SchedulerComponent: React.FC = () => {
  const [data, setData] = useState<AppointmentModel[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false);
  const [currentViewName, setCurrentViewName] = useState("Week");

  useEffect(() => {
    const userId = auth.currentUser?.uid;

    if (userId) {
      const q = query(
        collection(db, "appointments"),
        where("userId", "==", userId)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const appointmentsFromFirestore: AppointmentModel[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsFromFirestore.push({
            title: data.title,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
            notes: data.notes,
            userId: data.userId,
            allDay: data.allDay,
            id: doc.id,
            appointmentType: data.appointmentType,
          } as AppointmentModel);
        });
        setData(appointmentsFromFirestore);
      });

      return () => unsubscribe();
    }
  }, []);

  const commitChanges = useCallback(
    async ({ added, changed, deleted }: ChangeSet) => {
      const userId = auth.currentUser?.uid;

      if (!userId) return;

      if (added) {
        const newAppointment: AppointmentModel = {
          title: added.title || "Bez nazwy",
          startDate: dayjs(added.startDate).toDate(),
          endDate: dayjs(added.endDate).toDate(),
          notes: added.notes || "",
          userId,
          allDay: added.allDay,
          appointmentType: added.appointmentType || "Personal",
          id: "",
        };

        const docRef = doc(collection(db, "appointments"));
        const createdAppointment = { ...newAppointment, id: docRef.id };

        await setDoc(docRef, createdAppointment);
        // setData((prevData) => [
        //   ...prevData,
        //   createdAppointment, // Add the new appointment to state
        // ]);
      }
      if (changed) {
        let updatedAppointments = [...data];

        if (isShiftPressed) {
          const changedAppointment = updatedAppointments.find(
            (appointment) => changed[appointment.id]
          );
          if (changedAppointment) {
            const startingAddedId =
              updatedAppointments.length > 0
                ? updatedAppointments[updatedAppointments.length - 1].id + 1
                : 0;
            const newAppointment = {
              ...changedAppointment,
              id: startingAddedId,
              startDate: dayjs(
                changed[changedAppointment.id].startDate
              ).toDate(),
              endDate: dayjs(changed[changedAppointment.id].endDate).toDate(),
              appointmentType: changedAppointment.appointmentType,
            };
            const docRef = doc(collection(db, "appointments"));
            const createdAppointment = { ...newAppointment, id: docRef.id };

            await setDoc(docRef, createdAppointment);

            updatedAppointments = [...updatedAppointments, createdAppointment];
          }
        } else {
          updatedAppointments = await Promise.all(
            updatedAppointments.map(async (appointment) => {
              const appointmentId = appointment.id;
              const appointmentChanges = changed[appointmentId];

              if (appointmentChanges) {
                const updatedAppointment = {
                  ...appointment,
                  ...appointmentChanges,
                  allDay: appointmentChanges.allDay || false,
                  startDate: dayjs(
                    appointmentChanges.startDate || appointment.startDate
                  ).toDate(),
                  endDate: dayjs(
                    appointmentChanges.endDate || appointment.endDate
                  ).toDate(),
                };

                const appointmentDocRef = doc(
                  db,
                  "appointments",
                  appointmentId
                );
                await updateDoc(appointmentDocRef, updatedAppointment);
                return updatedAppointment;
              }
              return appointment;
            })
          );
        }

        setData(updatedAppointments);
      }

      if (deleted !== undefined) {
        const docRef = doc(db, "appointments", deleted.toString());
        await deleteDoc(docRef);
        setData(data.filter((appointment) => appointment.id !== deleted));
      }
    },
    [data, isShiftPressed]
  );

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === KEYBOARD_KEY) {
      setIsShiftPressed(true);
    }
  }, []);

  const onKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === KEYBOARD_KEY) {
      setIsShiftPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  return (
    <Box>
      <Paper>
        <Header />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={pl}>
          <Scheduler data={data} height={700} locale="pl-PL">
            <ViewState
              currentDate={currentDate.format("YYYY-MM-DD")}
              onCurrentDateChange={(date) => setCurrentDate(dayjs(date))}
              currentViewName={currentViewName}
              onCurrentViewNameChange={setCurrentViewName}
            />
            <EditingState onCommitChanges={commitChanges} />
            <IntegratedEditing />
            <DayView startDayHour={5} endDayHour={24} cellDuration={60} />
            <WeekView startDayHour={5} endDayHour={24} />
            <MonthView />
            <Appointments
              appointmentComponent={({ children, ...restProps }) => {
                const appointmentData = restProps.data;
                const backgroundColor =
                  appointmentColors[appointmentData.appointmentType] ||
                  appointmentColors.personal;

                return (
                  <Appointments.Appointment
                    {...restProps}
                    style={{ backgroundColor }}
                  >
                    {children}
                  </Appointments.Appointment>
                );
              }}
            />

            <Toolbar />
            <TodayButton messages={{ today: "Dzisiaj" }} />
            <DateNavigator />
            {/* <ViewSwitcher /> */}
            <Box className="flex justify-end absolute right-0">
              <CustomViewSwitcher
                currentViewName={currentViewName}
                onViewChange={setCurrentViewName}
              />
            </Box>
            <AppointmentTooltip showOpenButton showDeleteButton />
            <AppointmentForm
              basicLayoutComponent={BasicLayout}
              dateEditorComponent={CustomDateEditor}
              messages={{
                detailsLabel: "Szczegóły",
                allDayLabel: "Cały dzień",
                titleLabel: "Tytuł",
                commitCommand: "Zapisz",
                moreInformationLabel: "Więcej informacji",
                repeatLabel: "Powtarzaj",
                notesLabel: "Notatki",
                never: "Nigdy",
                daily: "Codziennie",
                weekly: "Co tydzień",
                monthly: "Co miesiąc",
                yearly: "Co roku",
                repeatEveryLabel: "Powtarzaj co",
                daysLabel: "dzień/dni",
                endRepeatLabel: "Zakończ powtarzanie",
                onLabel: "Po",
                afterLabel: "Po",
                occurrencesLabel: "powtórzeniach",
                weeksOnLabel: "tydzień/tygodnie w:",
                monthsLabel: "miesiąc/miesiące",
                ofEveryMonthLabel: "każdego miesiąca",
                theLabel: "W",
                firstLabel: "Pierwszy",
                secondLabel: "Drugi",
                thirdLabel: "Trzeci",
                fourthLabel: "Czwarty",
                lastLabel: "Ostatni",
                yearsLabel: "rok/lata",
                ofLabel: "z",
                everyLabel: "Każdy",
              }}
            />
            <ConfirmationDialog
              messages={{
                discardButton: "Tak",
                deleteButton: "Usuń",
                cancelButton: "Nie",
                confirmDeleteMessage:
                  "Czy na pewno chcesz usunąć to spotkanie?",
                confirmCancelMessage:
                  "Zmiany nie zostały zapisane. Czy na pewno chcesz je porzucić?",
              }}
            />
            <DragDropProvider
              draftAppointmentComponent={(props) => (
                <DraftAppointment {...props} currentView={currentViewName} />
              )}
              sourceAppointmentComponent={(props) => (
                <SourceAppointment {...props} currentView={currentViewName} />
              )}
            />
          </Scheduler>
        </LocalizationProvider>
      </Paper>
    </Box>
  );
};

export default SchedulerComponent;
