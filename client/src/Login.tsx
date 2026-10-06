import { ReactNode } from "react";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";
import { LoginForm } from "components/LoginForm";

// the app is shown only after logging in
export const Login = ({ children }: { children: ReactNode }) => {
  const { isLogIn } = useGlobalStoreContext();

  return isLogIn ? <>{children}</> : <LoginForm />;
};
