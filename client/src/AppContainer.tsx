import { Outlet } from "react-router";

import "App.css";
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
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>
    </AppShell>
  );
};

// the root route of the router - every page renders in its Outlet
export const AppContainer = () => (
  <Modals>
    <GlobalStoreContextProvider>
      <LoggedInOnly />
    </GlobalStoreContextProvider>
  </Modals>
);
