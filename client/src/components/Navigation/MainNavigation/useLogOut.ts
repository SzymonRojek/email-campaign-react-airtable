import { useNavigate } from "react-router";

import { useGlobalStoreContext } from "contexts/GlobalStoreContextProvider";

export const useLogOut = () => {
  const navigate = useNavigate();
  const { setIsLogIn } = useGlobalStoreContext();

  return () => {
    setIsLogIn(false);
    navigate("/");
  };
};
