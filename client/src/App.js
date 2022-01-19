import { useEffect } from "react";

import "./App.css";
import AppContainer from "./AppContainer";
import LoginForm from "./components/LoginForm/LoginForm";
import { useLocalStorageValue } from "./useLocalStorageValue";
import { Loader } from "components/DisplayMessage";

const App = () => {
  const [status, setStatus] = useLocalStorageValue("status", false);
  const [loginValue, setLoginValue] = useLocalStorageValue("login", false);

  useEffect(() => {
    const timeID = setTimeout(() => {
      if (loginValue) {
        setStatus(true);
      }
    }, 3_000);

    return () => clearTimeout(timeID);
  });

  return (
    <div className="page-container">
      {loginValue && !status ? (
        <Loader title="Log In" />
      ) : loginValue && status ? (
        <AppContainer setLoginValue={setLoginValue} setStatus={setStatus} />
      ) : (
        <LoginForm setLoginValue={setLoginValue} />
      )}
    </div>
  );
};

export default App;
