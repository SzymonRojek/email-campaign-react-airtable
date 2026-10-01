import { useEffect, useState } from "react";

export const useLocalStorageValue = (
  keyName,
  defaultValue,
  parseValue = (value) => value
) => {
  const getInitialValue = () => {
    const localStorageValue = localStorage.getItem(keyName);

    if (localStorageValue === null) {
      return defaultValue;
    }

    return parseValue(JSON.parse(localStorageValue));
  };

  const [state, setState] = useState(getInitialValue);

  useEffect(() => {
    localStorage.setItem(keyName, JSON.stringify(state));
  }, [keyName, state]);

  return [state, setState];
};
