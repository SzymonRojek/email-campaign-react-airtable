import React, { createContext, useState, useContext } from "react";

const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [text, setText] = useState({});
  const [action, setAction] = useState(null);
  const openPopup = () => setIsOpenPopup(true);
  const closePopup = () => setIsOpenPopup(false);
  const addTextPopup = (text) => setText(text);
  const handleAction = (param) => setAction(param);

  return (
    <PopupContext.Provider
      value={{
        isOpenPopup,
        setIsOpenPopup,
        openPopup,
        closePopup,
        text,
        addTextPopup,
        handleAction,
        action,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopup = () => useContext(PopupContext);
