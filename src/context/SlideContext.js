import React, {createContext, useEffect, useState} from 'react';
export const SlideContext = createContext();

export const SlideProvider = ({children}) => {
  const [slide, setSlide] = useState("home");
  const [groupChange, setGroupChange] = useState();

  return (
    <SlideContext.Provider
      value={{
        setSlide,
        slide,
        setGroupChange,
        groupChange
      }}>
      {children}
    </SlideContext.Provider>
  );
};
