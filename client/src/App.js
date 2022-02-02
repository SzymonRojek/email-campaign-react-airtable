import AppContainer from "./AppContainer";
import { ConfirmPopup, InfoPopup } from "./components/DisplayMessage";
import { StyledFooter } from "./components/StyledFooter";
import { useLocalStorageValue } from "./useLocalStorageValue";
import { PopupProvider } from "./popupContext";
import { Login } from "./Login";
import APIContextProvider from "./APiContextProvider";

const App = () => {
  const [statusLog, setStatusLog] = useLocalStorageValue("status", "loadingIn");
  const [isLogIn, setIsLogIn] = useLocalStorageValue("login", false);

  return (
    <div className="page-container">
      <Login
        isLogIn={isLogIn}
        setIsLogIn={setIsLogIn}
        statusLog={statusLog}
        setStatusLog={setStatusLog}
      >
        <PopupProvider>
          <APIContextProvider>
            <AppContainer setIsLogIn={setIsLogIn} setStatusLog={setStatusLog} />
          </APIContextProvider>
          <ConfirmPopup />
          <InfoPopup />
        </PopupProvider>
      </Login>

      <StyledFooter label="Coded By Szymon Rojek © 2022" />
    </div>
  );
};

export default App;
