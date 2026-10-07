import { FocusEvent, useEffect, useRef } from "react";
import { useBlocker } from "react-router";

// asks before leaving a form with unsaved changes: another page, "back",
// closing the subscriber panel (all are navigations) or closing the browser tab
export const useLeaveGuard = (isDirty: boolean) => {
  // a save that moves on (e.g. back to the list) or "Discard" must not ask
  const canLeave = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  // the field the user was in - "Keep editing" brings the keyboard back there
  const lastField = useRef<HTMLElement | null>(null);

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

  const restoreFocus = () => {
    const field =
      lastField.current?.isConnected
        ? lastField.current
        : form.current?.querySelector<HTMLElement>("input, textarea, button[role='combobox']");

    field?.focus();
  };

  // spread on the <form>
  const formProps = {
    ref: form,
    onFocusCapture: (event: FocusEvent<HTMLFormElement>) => {
      // React focus events bubble out of portals too (e.g. the question dialog) -
      // remember only the real fields of this form
      if (event.target instanceof HTMLElement && event.currentTarget.contains(event.target)) {
        lastField.current = event.target;
      }
    },
  };

  return { blocker, whileSaving, discard, restoreFocus, formProps };
};
