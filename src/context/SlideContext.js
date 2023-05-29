import React, {createContext, useContext, useEffect, useState} from 'react';
export const SlideContext = createContext();
export const SlideProvider = ({children}) => {
  const [slide, setSlide] = useState("home");
  const [groupChange, setGroupChange] = useState();
  const [groupName, setGroupName] = useState('');
  return (
    <SlideContext.Provider
      value={{
        setSlide,
        slide,
        setGroupChange,
        setGroupName,
        groupChange,
        groupName
      }}>
      {children}
    </SlideContext.Provider>
  );
};
