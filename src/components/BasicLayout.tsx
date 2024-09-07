import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }: any) => {
  const handleTypeChange = (event: SelectChangeEvent) => {
    onFieldChange({ appointmentType: event.target.value });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
      {...restProps}
    >
      <Grid container spacing={2} className='mt-4'>
        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel>Rodzaj Spotkania</InputLabel>
            <Select
              value={appointmentData.appointmentType || "Personal"}
              onChange={handleTypeChange}
              label="Rodzaj Spotkania"
            >
              <MenuItem value={"Meeting"}>Spotkanie</MenuItem>
              <MenuItem value={"Work"}>Praca</MenuItem>
              <MenuItem value={"Personal"}>Osobiste</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </AppointmentForm.BasicLayout>
  );
};

export default BasicLayout;