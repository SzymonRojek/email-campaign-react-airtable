import { ErrorBoundary } from "react-error-boundary";

import APIContextProvider from "./APiContextProvider";
import { Fallback } from "./components/Fallback";
import AppContainer from "./AppContainer";
import { ConfirmPopup, InfoPopup } from "./components/DisplayMessage";
import { StyledFooter } from "./components/StyledFooter";
import { PopupProvider } from "./popupContext";
import { Login } from "./Login";
import { MainNavigation } from "components/Navigation";

const App = () => {
  const handleError = (error, errorInfo) => {
    console.log("LoggingError", error, errorInfo);
  };

  return (
    <div className="page-container">
      <PopupProvider>
        <ErrorBoundary FallbackComponent={Fallback} onError={handleError}>
          <MainNavigation />

          <APIContextProvider>
            <Login>
              <AppContainer />
            </Login>
          </APIContextProvider>
        </ErrorBoundary>

        <ConfirmPopup />
        <InfoPopup />
      </PopupProvider>

      <StyledFooter label="Coded By Szymon Rojek © 2022" />
    </div>
  );
};

export default App;
