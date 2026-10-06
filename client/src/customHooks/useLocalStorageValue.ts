import { Dispatch, SetStateAction, useEffect, useState } from "react";

export const useLocalStorageValue = <T>(
  keyName: string,
  defaultValue: T,
  parseValue: (value: T) => T = (value) => value
): [T, Dispatch<SetStateAction<T>>] => {
  const getInitialValue = (): T => {
    try {
      const localStorageValue = localStorage.getItem(keyName);

      if (localStorageValue === null) {
        return defaultValue;
      }

      return parseValue(JSON.parse(localStorageValue));
    } catch {
      // no localStorage (e.g. private mode) or broken json
      return defaultValue;
    }
  };

  const [state, setState] = useState<T>(getInitialValue);

  useEffect(() => {
    try {
      localStorage.setItem(keyName, JSON.stringify(state));
    } catch {
      // no localStorage (e.g. private mode) - keep the value in memory only
    }
  }, [keyName, state]);

  return [state, setState];
};
