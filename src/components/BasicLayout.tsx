import { AppointmentForm } from "@devexpress/dx-react-scheduler-material-ui";
import { Checkbox, FormControl, FormControlLabel, Grid2 as Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

const CustomAllDayEditor: React.FC<AppointmentForm.BooleanEditorProps> = ({ value, onValueChange, ...restProps }) => (
  <FormControlLabel
      control={<Checkbox checked={value} onChange={(e) => onValueChange(e.target.checked)} />}
      label="Cały dzień"
      {...restProps}
  />
);


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
      {console.log(restProps)}
      <Grid container spacing={2} className='mt-4'>
        <Grid size={12}>
          <FormControl fullWidth>
            <InputLabel>Rodzaj Spotkania</InputLabel>
            <Select
              value={appointmentData.appointmentType || "Osobiste"}
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