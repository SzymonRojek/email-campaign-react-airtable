import { lazy, Suspense } from "react";
import { Outlet } from "react-router";

import "App.css";
import { LoginForm } from "components/LoginForm";
import { Loader } from "components/DisplayMessage";
import {
  GlobalStoreContextProvider,
  useGlobalStoreContext,
} from "contexts/GlobalStoreContextProvider";
import Modals from "./Modals";

// loaded only after logging in - the login page stays small and fast on phones
const AppShell = lazy(() => import("components/Navigation/AppShell"));

// the app is shown only after logging in
const LoggedInOnly = () => {
  const { isLogIn } = useGlobalStoreContext();

  if (!isLogIn) return <LoginForm />;

  return (
    <Suspense fallback={<Loader />}>
      <AppShell>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </AppShell>
    </Suspense>
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
