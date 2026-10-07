import { useLocation, useNavigate, useSearchParams } from "react-router";

// the subscriber panel lives in the address, so a link can open it and "back" closes it:
//   /subscribers?view=<id>            details
//   /subscribers?view=<id>&mode=edit  the edit form
//   /subscribers?mode=new             the "add subscriber" form
export const VIEW_PARAM = "view";
export const MODE_PARAM = "mode";

type PanelMode = "view" | "edit" | "new";

const panelSearch = (id?: string, mode?: "edit" | "new") => {
  const params = new URLSearchParams();
  if (id) params.set(VIEW_PARAM, id);
  if (mode) params.set(MODE_PARAM, mode);
  return `?${params}`;
};

// for a <Link> - opened from the app, so closing can simply go back
export const subscriberPanelLink = (id?: string, mode?: "edit" | "new") => ({
  to: { pathname: "/subscribers", search: panelSearch(id, mode) },
  state: { fromApp: true },
});

export const useSubscriberPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const viewId = searchParams.get(VIEW_PARAM);
  const modeParam = searchParams.get(MODE_PARAM);

  const mode: PanelMode =
    modeParam === "new" ? "new" : modeParam === "edit" && viewId ? "edit" : "view";
  const isOpen = Boolean(viewId) || mode === "new";
  const cameFromApp = Boolean((location.state as { fromApp?: boolean } | null)?.fromApp);

  // a panel that is already open is replaced - one "back" closes it
  const go = (id?: string, nextMode?: "edit" | "new") => {
    const { to, state } = subscriberPanelLink(id, nextMode);
    navigate(to, { state: isOpen ? location.state : state, replace: isOpen });
  };

  const close = () => {
    if (cameFromApp) {
      navigate(-1);
      return;
    }

    setSearchParams(
      (params) => {
        params.delete(VIEW_PARAM);
        params.delete(MODE_PARAM);
        return params;
      },
      { replace: true }
    );
  };

  return {
    viewId,
    mode,
    isOpen,
    open: (id: string) => go(id),
    edit: (id: string) => go(id, "edit"),
    create: () => go(undefined, "new"),
    close,
  };
};
