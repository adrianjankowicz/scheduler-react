import React, { useEffect, useState } from 'react';
import {
  Scheduler,
  WeekView,
  Appointments,
  MonthView,
  DayView,
  Toolbar,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';
import { EditingState, IntegratedEditing, AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Header from './Header';
import CustomViewSwitcher from './CustomViewSwitcher';
import { Box } from '@mui/material';
dayjs.locale('pl')


const SchedulerComponent: React.FC = () => {
  const [data, setData] = useState<AppointmentModel[]>([]);
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [currentViewName, setCurrentViewName] = useState('Month');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const events = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startDate: dayjs(data.startDate.toDate()).toDate(),
          endDate: dayjs(data.endDate.toDate()).toDate(),
        } as AppointmentModel;
      });
      setData(events);
    });
    return () => unsubscribe();
  }, []);

  const commitChanges = ({ added, changed, deleted }: any) => {
    if (added) {
      const newEvent: AppointmentModel = {
        ...added,
        startDate: dayjs(added.startDate).toDate(), 
        endDate: dayjs(added.endDate).toDate(),     
      };
      addDoc(collection(db, 'events'), newEvent);
    }
    if (changed) {
      const id = Object.keys(changed)[0];
      const updatedEvent: AppointmentModel = {
        ...changed[id],
        startDate: dayjs(changed[id].startDate).toDate(),
        endDate: dayjs(changed[id].endDate).toDate(),    
      };
      updateDoc(doc(db, 'events', id), updatedEvent);
    }
    if (deleted !== undefined) {
      deleteDoc(doc(db, 'events', deleted));
    }
  };

  return (
    <div>
      <Header />
    <div className="p-4 mt-12 md:mt-2 lg:mt-0">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Scheduler data={data} locale="pl-PL">
          <ViewState
            currentDate={currentDate.format('DD-MM-YYYY')}
            onCurrentDateChange={(date) => setCurrentDate(dayjs(date))}
            currentViewName={currentViewName}
            onCurrentViewNameChange={setCurrentViewName}
          />
          <EditingState onCommitChanges={commitChanges} />
          <IntegratedEditing />
          <DayView startDayHour={6} endDayHour={24} />
          <WeekView startDayHour={6} endDayHour={24} />
          <MonthView />
          <Appointments />
          <Toolbar />
          <DateNavigator />
          <Box className='flex justify-end flex-grow w-full border-b border-gray-300'>
          <CustomViewSwitcher 
              currentViewName={currentViewName}
              onViewChange={setCurrentViewName} 
            />
            </Box>
        </Scheduler>
      </LocalizationProvider>
    </div>
    </div>
  );
};

export default SchedulerComponent;
