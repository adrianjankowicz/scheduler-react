import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import appointmentColors from "../utils/colors";
import { Box } from "@mui/material";
import dayjs from "dayjs";

const DraftAppointment = ({ data, style, currentView, ...restProps }: any) => {
  const backgroundColor =
    appointmentColors[data.appointmentType] || appointmentColors["Personal"];
  console.log(currentView);

  return (
    <Appointments.Appointment
      {...restProps}
      data={data}
      style={{ ...style, backgroundColor }}
    >
      {currentView === "Month" ? (
        <Box className="text-white ml-[6px] mt-[1px]">{data.title}</Box>
      ) : currentView === "Week" ? (
        <Box>
          <Box className="text-white font-semibold mx-[8px] mt-[4px]">
            {data.title}
          </Box>
          <Box className="text-white ml-[8px] my-[-3px] flex space-x-2">
            <p>{`${dayjs(data.startDate).format("HH:mm")}`} </p>
            <p>-</p> <p>{`${dayjs(data.endDate).format("HH:mm")}`}</p>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box className="text-white font-semibold mx-[8px] mt-[4px]">
            {data.title}
          </Box>
          <Box className="text-white ml-[8px] my-[-3px] flex space-x-2">
            <p>{`${dayjs(data.startDate).format("HH:mm")}`} </p>
            <p>-</p> <p>{`${dayjs(data.endDate).format("HH:mm")}`}</p>
          </Box>
        </Box>
      )}
    </Appointments.Appointment>
  );
};

const SourceAppointment = ({ data, style, currentView, ...restProps }: any) => {
  const backgroundColor =
    appointmentColors[data.appointmentType] || appointmentColors["Personal"];

  return (
    <Appointments.Appointment
      {...restProps}
      data={data}
      style={{ ...style, backgroundColor, opacity: 0.5 }}
    >
      {currentView === "Month" ? (
        <Box className="text-white ml-[6px] mt-[1px]">{data.title}</Box>
      ) : currentView === "Week" ? (
        <Box>
          <Box className="text-white font-semibold mx-[8px] mt-[4px]">
            {data.title}
          </Box>
          <Box className="text-white ml-[8px] my-[-3px] flex space-x-2">
            <p>{`${dayjs(data.startDate).format("HH:mm")}`} </p>
            <p>-</p> <p>{`${dayjs(data.endDate).format("HH:mm")}`}</p>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box className="text-white font-semibold mx-[8px] mt-[4px]">
            {data.title}
          </Box>
          <Box className="text-white ml-[8px] my-[-3px] flex space-x-2">
            <p>{`${dayjs(data.startDate).format("HH:mm")}`} </p>
            <p>-</p> <p>{`${dayjs(data.endDate).format("HH:mm")}`}</p>
          </Box>
        </Box>
      )}
    </Appointments.Appointment>
  );
};

export {
  DraftAppointment,
  SourceAppointment,
};
