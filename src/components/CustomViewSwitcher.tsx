import {
  Toolbar,
  DateNavigator,
  TodayButton,
} from "@devexpress/dx-react-scheduler-material-ui";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const CustomViewSwitcher = ({ currentViewName, onViewChange }: any) => (
  <Toolbar.Root className="flex items-center">
    <FormControl className="ml-2 border border-gray-300 rounded-md">
      <Select
        id="view-select"
        value={currentViewName}
        onChange={(event) => onViewChange(event.target.value)}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        className="w-full p-2"
      >
        <MenuItem value="Day">Dzień</MenuItem>
        <MenuItem value="Week">Tydzień</MenuItem>
        <MenuItem value="Month">Miesiąc</MenuItem>
      </Select>
    </FormControl>
  </Toolbar.Root>
);

export default CustomViewSwitcher;
