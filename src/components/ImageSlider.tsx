import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';

// Import your images
import calendarView1 from '../images/calendarView1.png';
import calendarView2 from '../images/calendarView2.png';
import calendarView3 from '../images/calendarView3.png';
import calendarView4 from '../images/calendarView4.png';


const ImageSlider = () => {
    const [index, setIndex] = useState(0);
    const images = [calendarView1, calendarView2, calendarView3, calendarView4];
  
    const handleNext = () => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
  
    const handleBack = () => {
      setIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
  
    return (
      <Box className="flex justify-center items-center">
        <IconButton onClick={handleBack} aria-label="previous">
          <ChevronLeft />
        </IconButton>
        <Box width="720px" height="auto">
          <SwipeableViews index={index} onChangeIndex={setIndex}>
            {images.map((img, i) => (
              <div key={i}>
                <img
                  src={img}
                  alt={`Zrzut ekranu kalendarza ${i + 1}`}
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            ))}
          </SwipeableViews>
        </Box>
        <IconButton onClick={handleNext} aria-label="next">
          <ChevronRight />
        </IconButton>
      </Box>
    );
  };
  
  export default ImageSlider;