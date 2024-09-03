import React, { useState, useEffect, useCallback } from "react";
import Paper from "@mui/material/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
  ChangeSet,
  FormatterFn,
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
  ViewSwitcher,
} from "@devexpress/dx-react-scheduler-material-ui";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import Header from "./Header";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { deDE } from "@mui/x-date-pickers/locales";
import updateLocale from "dayjs/plugin/updateLocale";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

dayjs.locale("de");
dayjs.extend(updateLocale);

dayjs.updateLocale("de", {
  weekStart: 1,
});

interface AppointmentModel {
  title: string;
  startDate: Date;
  endDate: Date;
  rRule?: string;
  exDate?: string;
  allDay?: boolean;
  location?: string;
  customField?: string;
  userId: string;
  id: string;
}

const KEYBOARD_KEY = "Shift";

const TextEditor = (props: any) => {
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }: any) => {
  const onCustomFieldChange = (nextValue: string) => {
    onFieldChange({ customField: nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <AppointmentForm.Label text="Niestandardowe pole" type="ordinaryLabel" />
      <AppointmentForm.TextEditor
        value={appointmentData.customField}
        onValueChange={onCustomFieldChange}
        placeholder="Niestandardowe pole"
        readOnly={false}
        type="ordinaryTextEditor"
      />
    </AppointmentForm.BasicLayout>
  );
};

const SchedulerComponent: React.FC = () => {
  const [data, setData] = useState<AppointmentModel[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false);
  const [currentViewName, setCurrentViewName] = useState("Month");

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
            customField: data.customField,
            userId: data.userId,
            id: doc.id,
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
      console.log('datra', data);

      if (!userId) return;
      
      if (added) {
        console.log(1);
        const newAppointment: AppointmentModel = {
          title: added.title || "Bez nazwy",
          startDate: dayjs(added.startDate).toDate(),
          endDate: dayjs(added.endDate).toDate(),
          customField: added.customField || "",
          userId,
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
        console.log("Changed appointments:", changed);
  
        let updatedAppointments = [...data];
  
        if (isShiftPressed) {
          const changedAppointment = updatedAppointments.find((appointment) => changed[appointment.id]);
          if (changedAppointment) {
            const startingAddedId = updatedAppointments.length > 0 ? updatedAppointments[updatedAppointments.length - 1].id + 1 : 0;
            const newAppointment = {
              ...changedAppointment,
              id: startingAddedId,
              startDate: dayjs(changed[changedAppointment.id].startDate).toDate(),
              endDate: dayjs(changed[changedAppointment.id].endDate).toDate(),
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
                  startDate: dayjs(appointmentChanges.startDate).toDate(),
                  endDate: dayjs(appointmentChanges.endDate).toDate(),
                };
  
                const appointmentDocRef = doc(db, "appointments", appointmentId);
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
        console.log(3);
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
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      localeText={
        deDE.components.MuiLocalizationProvider.defaultProps.localeText
      }
      adapterLocale="de"
    >
      <Paper>
        <Header />
        <Scheduler data={data} height={700} locale="pl-PL">
          <ViewState
            currentDate={currentDate.format("YYYY-MM-DD")}
            onCurrentDateChange={(date) => setCurrentDate(dayjs(date))}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView />
          <WeekView startDayHour={9} endDayHour={17} />
          <MonthView />
          <Appointments />
          <Toolbar />
          <TodayButton />
          <DateNavigator />
          <ViewSwitcher />
          {
}
          <AppointmentTooltip showOpenButton showDeleteButton />
          <AppointmentForm
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
          />
          <ConfirmationDialog />
          <DragDropProvider />
        </Scheduler>
      </Paper>
    </LocalizationProvider>
  );
};

export default SchedulerComponent;
