import "App.css";
import Routing from "./Routing";
import { AppShell } from "components/Navigation";
import { LoginForm } from "components/LoginForm";
import {
  GlobalStoreContextProvider,
  useGlobalStoreContext,
} from "contexts/GlobalStoreContextProvider";
import Modals from "./Modals";

// the app is shown only after logging in
const LoggedInOnly = () => {
  const { isLogIn } = useGlobalStoreContext();

  if (!isLogIn) return <LoginForm />;

  return (
    <AppShell>
      <Routing />
    </AppShell>
  );
};

export const AppContainer = () => (
  <Modals>
    <GlobalStoreContextProvider>
      <LoggedInOnly />
    </GlobalStoreContextProvider>
  </Modals>
);
