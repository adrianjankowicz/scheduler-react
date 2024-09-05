import { Appointments } from "@devexpress/dx-react-scheduler-material-ui";
import appointmentColors from "../utils/colors";
import { Box } from "@mui/material";

const DraftAppointment = ({ data, style, ...restProps }: any) => {
    const backgroundColor =
    appointmentColors[data.appointmentType] || appointmentColors["Personal"];
  
    return (
      <Appointments.Appointment
        {...restProps}
        data={data}
        style={{ ...style, backgroundColor }}
      >
        <Box className='text-white mx-[6px] my-[1px]'>{data.title}</Box>
      </Appointments.Appointment>
    );
  };
  
  const SourceAppointment = ({ data, style, ...restProps }: any) => {
    const backgroundColor =
      appointmentColors[data.appointmentType] || appointmentColors["Personal"];
  
    return (
      <Appointments.Appointment
        {...restProps}
        data={data}
        style={{ ...style, backgroundColor, opacity: 0.5 }}
      >
        <Box className='text-white mx-[6px] my-[1px]'>{data.title}</Box>
        </Appointments.Appointment>
    );
  };

  export { DraftAppointment, SourceAppointment };