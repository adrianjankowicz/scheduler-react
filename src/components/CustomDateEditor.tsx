
import * as React from 'react';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';
import { AppointmentForm } from '@devexpress/dx-react-scheduler';

type DateEditorProps = AppointmentForm.DateEditorProps;

const CustomDateEditor: React.FC<DateEditorProps> = ({ value, onValueChange, ...restProps }) => {
    const handleDateChange = (date: { toDate: () => Date; } | null) => {
        onValueChange(date ? date.toDate() : new Date());
    };

  return (
    <div className="flex space-x-2 mt-3">
      <DatePicker
        value={dayjs(value)}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} label="Wybierz datę" />}
        inputFormat="DD.MM.YYYY"
      />
      <TimePicker
        value={dayjs(value)}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} label="Wybierz czas" />}
        ampm={false}
        inputFormat="HH:mm"
      />
    </div>
  );
};

export default CustomDateEditor;