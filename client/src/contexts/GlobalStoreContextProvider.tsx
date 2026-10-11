import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorageValue } from "customHooks/useLocalStorageValue";
import { getToken, removeToken, UNAUTHORIZED_EVENT } from "services/authToken";

// who gets the job offer being written: the candidates open to offers in a role, within
// a budget; skipRecent leaves out the ones who got an offer in the last 14 days
export interface RecipientFilter {
  role: string; // "" = every role
  maxSalary: string; // "" = any budget
  skipRecent: boolean;
}

export const NO_RECIPIENT_FILTER: RecipientFilter = { role: "", maxSalary: "", skipRecent: true };

interface GlobalStoreContextValue {
  isLogIn: boolean;
  setIsLogIn: Dispatch<SetStateAction<boolean>>;
  recipientFilter: RecipientFilter;
  // a new filter drops the people chosen by hand - they were chosen from another list
  updateRecipientFilter: (change: Partial<RecipientFilter>) => void;
  // the ids chosen by hand in the dialog; null = everybody the filter finds
  chosenRecipientIds: string[] | null;
  setChosenRecipientIds: Dispatch<SetStateAction<string[] | null>>;
  // the next job offer starts from scratch
  resetRecipients: () => void;
}

const GlobalStoreContext = createContext<GlobalStoreContextValue | undefined>(
  undefined
);

export const GlobalStoreContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLogIn, setIsLogIn] = useLocalStorageValue<boolean>(
    "login",
    false,
    // logged in only together with a token from the server
    (value) => value && Boolean(getToken())
  );

  // log out - drop the token from the server
  useEffect(() => {
    if (!isLogIn) removeToken();
  }, [isLogIn]);

  // the server rejected the token (expired / invalid)
  useEffect(() => {
    const handleUnauthorized = () => setIsLogIn(false);

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [setIsLogIn]);

  const [recipientFilter, setRecipientFilter] = useState(NO_RECIPIENT_FILTER);
  const [chosenRecipientIds, setChosenRecipientIds] = useState<string[] | null>(null);

  const updateRecipientFilter = useCallback((change: Partial<RecipientFilter>) => {
    setRecipientFilter((filter) => ({ ...filter, ...change }));
    setChosenRecipientIds(null);
  }, []);

  const resetRecipients = useCallback(() => {
    setRecipientFilter(NO_RECIPIENT_FILTER);
    setChosenRecipientIds(null);
  }, []);

  const contextValues = {
    isLogIn,
    setIsLogIn,
    recipientFilter,
    updateRecipientFilter,
    chosenRecipientIds,
    setChosenRecipientIds,
    resetRecipients,
  };

  return (
    <GlobalStoreContext.Provider value={contextValues}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export const useGlobalStoreContext = () => {
  const context = useContext(GlobalStoreContext);
  if (context === undefined) {
    throw new Error("GlobalStoreContext must be used within a Provider");
  }
  return context;
};
