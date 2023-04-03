import React, {createContext, useEffect, useState} from 'react';
export const ImageContext = createContext();

export const ImageProvider = ({children}) => {
    const [imageuri, setImageUri] = useState('');
    const [modalVisibleStatus, setModalVisibleStatus] = useState(false);
    

  return (
    <ImageContext.Provider
      value={{
        setImageUri,
        setModalVisibleStatus,
        imageuri,
        modalVisibleStatus
      }}>
      {children}
    </ImageContext.Provider>
  );
};
