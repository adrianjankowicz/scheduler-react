import React from "react";
import { Box, Button, Grid2 as Grid } from "@mui/material";
import Header from "./Header";
import { useUser } from "../context/UserContext";
import calendarView from "../utils/calendarView.png";

const Home: React.FC = () => {
  const { handleLogin } = useUser();

  return (
    <Box className="">
      <Header />
      <Box className="flex-grow p-4 mt-4">
        <Box className="flex justify-center space-x-20 items-center mx-2">
          <Box className="flex flex-col justify-center max-w-lg mr-4">
            <h2 className="font-bold mb-8 text-4xl text-center">
              Planowanie Nigdy Nie Było Łatwiejsze!
            </h2>
            <p className=" text-lg mb-3">
              Aplikacja Scheduler to narzędzie stworzone z myślą o efektywnym
              zarządzaniu czasem. Umożliwia organizację spotkań, wydarzeń oraz
              zadań w przejrzystym kalendarzu, co pozwala na lepsze planowanie
              dnia.
            </p>
            <p className=" text-lg mb-3">
              Zaloguj się, aby uzyskać dostęp do wszystkich funkcji aplikacji,
              takich jak dodawanie nowych wydarzeń czy przeglądanie
              harmonogramu.
            </p>
            <p className=" text-lg mb-8">
              Twoje dane są bezpiecznie zapisywane w chmurze, co oznacza, że
              możesz korzystać z aplikacji z dowolnego miejsca i nie musisz się
              martwić o ich utratę. Dołącz do nas już dziś i zacznij efektywnie
              zarządzać swoim czasem!
            </p>
            <Box className="flex justify-center items-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogin}
                className="w-48"
              >
                Zaloguj się
              </Button>
            </Box>
          </Box>

          <Box className="flex justify-center items-center">
            <img
              src={calendarView}
              alt="Zrzut ekranu kalendarza"
              className="rounded-lg shadow-lg w-[720px]"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
