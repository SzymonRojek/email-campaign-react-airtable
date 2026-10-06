import "App.css";
import Routing from "./Routing";
import { MainNavigation } from "components/Navigation";
import { Login } from "./Login";
import { StyledFooter } from "components/StyledFooter";
import { GlobalStoreContextProvider } from "contexts/GlobalStoreContextProvider";
import Modals from "./Modals";

export const AppContainer = () => {
  return (
    <Modals>
      <GlobalStoreContextProvider>
        <MainNavigation />

        <main className="flex flex-1 flex-col">
          <Login>
            <Routing />
          </Login>
        </main>

        <StyledFooter label="Coded By Szymon Rojek © 2022" />
      </GlobalStoreContextProvider>
    </Modals>
  );
};
