import {
    Scheduler,
    WeekView,
    Appointments,
    MonthView,
    DayView,
    Toolbar,
    DateNavigator,
  } from '@devexpress/dx-react-scheduler-material-ui';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const CustomViewSwitcher = ({ currentViewName, onViewChange }: any) => (
    <Toolbar.Root>
      <DateNavigator />
      <FormControl variant="outlined" sx={{ minWidth: 120, marginLeft: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
      <Select
        id="view-select"
        value={currentViewName}
        onChange={(event) => onViewChange(event.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="Day">Dzień</MenuItem>
        <MenuItem value="Week">Tydzień</MenuItem>
        <MenuItem value="Month">Miesiąc</MenuItem>
      </Select>
      </FormControl>
    </Toolbar.Root>
  );
  
  export default CustomViewSwitcher;