import { useMemo } from "react";

import { lastContactedByCandidate } from "helpers/lastContacted";
import { useOutbox } from "customHooks/queries";

// candidate id -> when they got their newest job offer (empty while the outbox loads)
export const useLastContacted = () => {
  const { data: emails } = useOutbox();

  return useMemo(() => lastContactedByCandidate(emails ?? []), [emails]);
};
