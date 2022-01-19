import { useEffect, useState } from "react";

// export const useLocalStorageValue = (localStorageKey, localStorageValue) => {
//   const [value, setValue] = useState(
//     localStorage.getItem(localStorageKey) || ""
//   );

//   useEffect(() => {
//     localStorage.setItem(localStorageKey, value);
//   }, [value]);

//   return [value, setValue];
// };

export const useLocalStorageValue = (keyName, defaultValue) => {
  const getInitialValue = () => {
    const localStorageValue = localStorage.getItem(keyName);

    if (localStorageValue === null) {
      return defaultValue;
    }

    return JSON.parse(localStorage.getItem(keyName));
  };

  const [state, setState] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(keyName, JSON.stringify(state));
  }, [keyName, state]);

  return [state, setState];
};
