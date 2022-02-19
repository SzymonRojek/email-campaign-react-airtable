import { useEffect } from "react";

import { usePopupContext } from "contexts/popupContextProvider";
import { LoginForm } from "components/LoginForm";
import { Loader } from "components/DisplayMessage";

export const Login = ({ children }) => {
  const { isLogIn, statusLog, setStatusLog } = usePopupContext();

  useEffect(() => {
    const timeID = setTimeout(() => {
      if (isLogIn) setStatusLog("success");
    }, 3_000);

    return () => clearTimeout(timeID);
  });

  return (
    <>
      {isLogIn && statusLog === "loadingIn" ? (
        <Loader title="Log In" />
      ) : statusLog === "success" ? (
        <>{children}</>
      ) : statusLog === "loadingOut" ? (
        <Loader title="Log Out" />
      ) : (
        <LoginForm />
      )}
    </>
  );
};
