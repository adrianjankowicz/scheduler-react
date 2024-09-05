import React from "react";
import { useUser } from "../context/UserContext";
import {
  Button,
  Box,
  Avatar,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useThemeContext } from "../context/ThemeContext";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LogoutIcon from "@mui/icons-material/Logout";

interface HeaderProps {
  position?: "absolute" | "static";
}
const Header: React.FC<HeaderProps> = ({ position = "static" }) => {
  const { toggleTheme, isDarkMode } = useThemeContext();

  const { user, isLoading, handleLogin, handleLogout } = useUser();

  return (
    <Box
      className={` ${
        position === "absolute" ? "absolute" : "static"
      } top-0 left-0 right-0`}
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        className="absolute left-0 top-0 sm:left-5 sm:top-5"
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <h1
        className="text-center text-red-400 flex-nowrap whitespace-nowrap overflow-hidden font-bold text-6xl py-5"
        style={{ textShadow: "0 0 5px black, 0 0 20px white" }}
      >
        Scheduler
      </h1>

      <Box className="absolute right-2 top-2 sm:right-5 sm:top-10 flex items-center">
        {isLoading ? (
          <CircularProgress size={24} className="m-4 mr-6" />
        ) : user ? (
          <Box className="flex justify-center items-center space-x-4">
            <Box className="hidden sm:flex justify-center items-center space-x-2">
              <h2 className="hidden lg:inline-block">
                Witaj, <span className="font-semibold">{user.displayName}</span>
              </h2>
              <Avatar
                alt={user.displayName || "User"}
                src={user.photoURL || ""}
                className="w-[40px] h-[40px]"
              />
            </Box>
            <Box className="hidden sm:inline-block">
              <Button onClick={handleLogout} variant="outlined">
                Wyloguj
              </Button>
            </Box>
            <Box className="inline-block sm:hidden">
              <LogoutIcon onClick={handleLogout} />
            </Box>
          </Box>
        ) : (
          <Button onClick={handleLogin} className="flex items-center">
            <img
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              alt="Google Logo"
              className="w-[20px] mr-2"
            />
            <span className="hidden sm:inline">Zaloguj</span>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
