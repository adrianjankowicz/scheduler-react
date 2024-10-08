import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { plPL as corePlPL } from "@mui/material/locale";
import { plPL as pickersPlPL } from "@mui/x-date-pickers";
import { plPL as dataGridPlPL } from '@mui/x-data-grid/locales';

interface ThemeContextProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const theme = createTheme(
    {
      palette: {
        mode: isDarkMode ? "dark" : "light",
      },
    },
    corePlPL,
    pickersPlPL,
    dataGridPlPL
  );

  return (
    <ThemeContext.Provider value={{ toggleTheme, isDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />{" "}
          {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
