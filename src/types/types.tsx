import { User } from "firebase/auth";

export interface AppointmentModel {
  title: string;
  startDate: Date;
  endDate: Date;
  rRule?: string;
  exDate?: string;
  allDay: boolean;
  location?: string;
  notes?: string;
  appointmentType:  string;
  userId: string;
  id: string;
}

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
}