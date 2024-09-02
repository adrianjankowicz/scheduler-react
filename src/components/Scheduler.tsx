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
} from "@devexpress/dx-react-scheduler-material-ui";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Header from "./Header";
import CustomViewSwitcher from "./CustomViewSwitcher";
import { Box } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { plPL } from "@mui/x-date-pickers/locales";


dayjs.locale("pl");

interface AppointmentModel {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  rRule?: string;
  exDate?: string;
  allDay?: boolean;
  location?: string;
  customField?: string;
}

const KEYBOARD_KEY = "Shift";

const appointments: AppointmentModel[] = [
  {
    id: 1,
    title: "Website Re-Design Plan",
    startDate: new Date(2024, 9, 25, 9, 15),
    endDate: new Date(2018, 9, 25, 11, 30),
  },
  {
    id: 2,
    title: "Book Flights to San Fran for Sales Trip",
    startDate: new Date(2024, 9, 2, 12, 11),
    endDate: new Date(2024, 9, 5, 13, 0),
  },
  {
    id: 3,
    title: "Install New Router in Dev Room",
    startDate: new Date(2024, 9, 7, 13, 30),
    endDate: new Date(2024, 9, 7, 14, 35),
  },
];

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
  const [data, setData] = useState<AppointmentModel[]>(appointments);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isShiftPressed, setIsShiftPressed] = useState<boolean>(false);
  const [currentViewName, setCurrentViewName] = useState("Month");

  const commitChanges = useCallback(
    ({ added, changed, deleted }: ChangeSet) => {
      setData((prevData) => {
        let updatedData = prevData;

        if (added) {
          const startingAddedId =
            updatedData.length > 0
              ? updatedData[updatedData.length - 1].id + 1
              : 0;

          const newAppointment: AppointmentModel = {
            id: startingAddedId,
            title: added.title || "",
            startDate: dayjs(added.startDate).isValid()
              ? dayjs(added.startDate).toDate()
              : dayjs().toDate(),
            endDate: dayjs(added.endDate).isValid()
              ? dayjs(added.endDate).toDate()
              : dayjs().toDate(),
            customField: added.customField || "",
          };

          updatedData = [...updatedData, newAppointment];
        }

        if (changed) {
          if (isShiftPressed) {
            const changedAppointment = updatedData.find(
              (appointment) => changed[appointment.id]
            );
            if (changedAppointment) {
              const startingAddedId =
                updatedData.length > 0
                  ? updatedData[updatedData.length - 1].id + 1
                  : 0;

              const newAppointment = {
                ...changedAppointment,
                id: startingAddedId,
                startDate: dayjs(
                  changed[changedAppointment.id].startDate
                ).isValid()
                  ? dayjs(changed[changedAppointment.id].startDate).toDate()
                  : dayjs().toDate(),
                endDate: dayjs(changed[changedAppointment.id].endDate).isValid()
                  ? dayjs(changed[changedAppointment.id].endDate).toDate()
                  : dayjs().toDate(),
                ...changed[changedAppointment.id],
              };

              updatedData = [...updatedData, newAppointment];
            }
          } else {
            updatedData = updatedData.map((appointment) => {
              if (changed[appointment.id]) {
                return {
                  ...appointment,
                  startDate: dayjs(changed[appointment.id].startDate).isValid()
                    ? dayjs(changed[appointment.id].startDate).toDate()
                    : dayjs().toDate(),
                  endDate: dayjs(changed[appointment.id].endDate).isValid()
                    ? dayjs(changed[appointment.id].endDate).toDate()
                    : dayjs().toDate(),
                  ...changed[appointment.id],
                };
              }
              return appointment;
            });
          }
        }

        if (deleted !== undefined) {
          updatedData = updatedData.filter(
            (appointment) => appointment.id !== deleted
          );
        }
        return updatedData;
      });
    },
    [isShiftPressed]
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
      localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText}      >
      <Paper>
        <Header />
        <Scheduler data={data} height={660} locale="pl-PL">
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
          <TodayButton/>
          {/* <DateNavigator /> */}
          <Box className="flex justify-end flex-grow w-full border-b border-gray-300">
            <CustomViewSwitcher
              currentViewName={currentViewName}
              onViewChange={setCurrentViewName}
            />
          </Box>
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
