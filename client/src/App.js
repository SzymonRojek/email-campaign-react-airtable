import { useEffect } from "react";

import "./App.css";
import AppContainer from "./AppContainer";
import { LoginForm } from "components/LoginForm";
import { Loader } from "components/DisplayMessage";
import { StyledFooter } from "components/StyledFooter";
import { useLocalStorageValue } from "./useLocalStorageValue";

const App = () => {
  const [statusLog, setStatusLog] = useLocalStorageValue("status", "loadingIn");
  const [isLogIn, setIsLogIn] = useLocalStorageValue("login", false);

  useEffect(() => {
    const timeID = setTimeout(() => {
      if (isLogIn) setStatusLog("success");
    }, 3_000);

    return () => clearTimeout(timeID);
  });

  return (
    <div className="page-container">
      {isLogIn && statusLog === "loadingIn" ? (
        <Loader title="Log In" />
      ) : statusLog === "success" ? (
        <AppContainer setIsLogIn={setIsLogIn} setStatusLog={setStatusLog} />
      ) : statusLog === "loadingOut" ? (
        <Loader title="Log Out" />
      ) : (
        <LoginForm setIsLogIn={setIsLogIn} />
      )}

      <StyledFooter label="Coded By Szymon Rojek © 2022" />
    </div>
  );
};

export default App;
