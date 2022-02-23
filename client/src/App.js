import { ErrorBoundary } from "react-error-boundary";

import { Fallback } from "components/Fallback";
import AppContainer from "AppContainer";
import { StyledFooter } from "components/StyledFooter";
import { Login } from "Login";
import { MainNavigation } from "components/Navigation";
import { APIcontextProvider } from "contexts/APIcontextProvider";
import { GlobalStoreContextProvider } from "contexts/GlobalStoreContextProvider";
import Modals from "./Modals";

const App = () => {
  const handleError = (error, errorInfo) => {
    console.log("LoggingError", error, errorInfo);
  };

  return (
    <div className="page-container">
      <Modals>
        <GlobalStoreContextProvider>
          {/* <ErrorBoundary FallbackComponent={Fallback} onError={handleError}> */}
          <MainNavigation />

          <Login>
            <APIcontextProvider>
              <AppContainer />
            </APIcontextProvider>
          </Login>
          {/* </ErrorBoundary> */}
        </GlobalStoreContextProvider>
      </Modals>
      <StyledFooter label="Coded By Szymon Rojek © 2022" />
    </div>
  );
};

export default App;
