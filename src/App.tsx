import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Scheduler from "./components/Scheduler";
import Home from "./components/Home";

import { UserProvider } from "./context/UserContext";
import { useUser } from "./context/UserContext";

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
      <ThemeProvider theme={theme}>
        {user ? <Scheduler /> : <Home />}
      </ThemeProvider>
  );
};

export default App;
