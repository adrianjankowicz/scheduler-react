import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase/firebase";
import { useUser } from '../context/UserContext';
import { Button, Box, Avatar, CircularProgress } from "@mui/material";

interface HeaderProps {
  position?: "absolute" | "static";
}
const Header: React.FC<HeaderProps> = ({ position = "static" }) => {

    const { user, isLoading, handleLogin, handleLogout } = useUser();

  return (
    <Box
      className={` ${
        position === "absolute" ? "absolute" : "static"
      } top-0 left-0 right-0`}
    >
      <h1
        className="text-center text-red-400 flex-nowrap whitespace-nowrap overflow-hidden font-bold text-2xl sm:text-4xl md:text-7xl lg:text-8xl py-5"
        style={{ textShadow: "0 0 5px black, 0 0 20px white" }}
      >
        Scheduler
      </h1>

      <Box className="absolute right-5 top-5 flex items-center">
        {isLoading ? (
          <CircularProgress size={24} className="m-4 mr-6" />
        ) : user ? (
          <Box className="flex items-center space-x-4">
            <h2 className="text-gray-600 hidden sm:inline">
              Witaj, <span className="font-semibold">{user.displayName}</span>
            </h2>
            <Avatar
              alt={user.displayName || "User"}
              src={user.photoURL || ""}
              className="w-[40px] h-[40px]"
            />
            <Button onClick={handleLogout} variant="outlined" className="ml-4">
              Logout
            </Button>
          </Box>
        ) : (
          <Button onClick={handleLogin} className="flex items-center">
            <img
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              alt="Google Logo"
              className="w-[20px] mr-2"
            />
            <span className="hidden sm:inline">Log In</span>
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Header;
