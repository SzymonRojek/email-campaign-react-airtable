import { useEffect, useRef } from "react";
import { useBlocker } from "react-router";

// asks before leaving a form with unsaved changes: another page, "back",
// closing the subscriber panel (all are navigations) or closing the browser tab
export const useLeaveGuard = (isDirty: boolean) => {
  // a save that moves on (e.g. back to the list) or "Discard" must not ask
  const canLeave = useRef(false);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty &&
      !canLeave.current &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search)
  );

  useEffect(() => {
    if (!isDirty) return;

    // the browser shows its own "Leave site?" question
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const whileSaving = async (save: () => Promise<void> | void) => {
    canLeave.current = true;
    try {
      await save();
    } finally {
      canLeave.current = false;
    }
  };

  // "Discard" in the question - the router checks the blocker again when it
  // repeats a "back" navigation, so it must already be allowed
  const discard = () => {
    canLeave.current = true;
    blocker.proceed?.();
  };

  return { blocker, whileSaving, discard };
};
