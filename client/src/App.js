import { ErrorBoundary } from "react-error-boundary";

import { Fallback } from "components/Fallback";
import AppContainer from "AppContainer";
import { ConfirmPopup, InfoPopup } from "components/DisplayMessage";
import { StyledFooter } from "components/StyledFooter";
import { Login } from "Login";
import { MainNavigation } from "components/Navigation";
import { APIcontextProvider } from "contexts/APIcontextProvider";
import { PopupContextProvider } from "contexts/popupContextProvider";

const App = () => {
  const handleError = (error, errorInfo) => {
    console.log("LoggingError", error, errorInfo);
  };

  return (
    <div className="page-container">
      <PopupContextProvider>
        <ErrorBoundary FallbackComponent={Fallback} onError={handleError}>
          <MainNavigation />

          <APIcontextProvider>
            <Login>
              <AppContainer />
            </Login>
          </APIcontextProvider>
        </ErrorBoundary>

        <ConfirmPopup />
        <InfoPopup />
      </PopupContextProvider>

      <StyledFooter label="Coded By Szymon Rojek © 2022" />
    </div>
  );
};

export default App;
