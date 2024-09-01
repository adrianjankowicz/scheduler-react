import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import SchedulerComponent from "./components/Scheduler";
import Home from "./components/Home";

import { UserProvider } from "./context/UserContext";
import { useUser } from "./context/UserContext";
import { ThemeContextProvider } from "./context/ThemeContext";

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

const AppContent: React.FC = () => {
  const { user } = useUser(); 

  return (
    <ThemeContextProvider>
        {user ? <SchedulerComponent /> : <Home />}
        </ThemeContextProvider>
  );
};

export default App;
