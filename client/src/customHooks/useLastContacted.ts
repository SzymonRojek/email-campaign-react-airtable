import { useMemo } from "react";

import { lastContactedBySubscriber } from "helpers/lastContacted";
import { useOutbox } from "customHooks/queries";

// subscriber id -> when they got their newest job offer (empty while the outbox loads)
export const useLastContacted = () => {
  const { data: emails } = useOutbox();

  return useMemo(() => lastContactedBySubscriber(emails ?? []), [emails]);
};
