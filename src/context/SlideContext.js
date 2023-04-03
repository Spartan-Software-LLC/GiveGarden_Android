import React, {createContext, useEffect, useState} from 'react';
export const SlideContext = createContext();

export const SlideProvider = ({children}) => {
  const [slide, setSlide] = useState('home');

  return (
    <SlideContext.Provider
      value={{
        setSlide,
        slide,
      }}>
      {children}
    </SlideContext.Provider>
  );
};