import {
  Toolbar,
} from "@devexpress/dx-react-scheduler-material-ui";
import { FormControl, MenuItem, Select } from "@mui/material";

const CustomViewSwitcher = ({ currentViewName, onViewChange }: any) => (
  <Toolbar.Root className="flex items-center" style={{ borderBottom: 'none', zIndex: 1 }}>
    <FormControl className='ml-2 rounded-md'>
      <Select
        id="view-select"
        value={currentViewName}
        onChange={(event) => onViewChange(event.target.value)}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        className="w-full "
      >
        <MenuItem value="Day">Dzień</MenuItem>
        <MenuItem value="Week">Tydzień</MenuItem>
        <MenuItem value="Month">Miesiąc</MenuItem>
      </Select>
    </FormControl>
  </Toolbar.Root>
);

export default CustomViewSwitcher;
