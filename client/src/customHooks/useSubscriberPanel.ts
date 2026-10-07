import { useLocation, useNavigate, useSearchParams } from "react-router";

// the subscriber details panel lives in the address: /subscribers?view=<id>
// - a link can open it and the browser "back" closes it
export const VIEW_PARAM = "view";

export const subscriberPanelLink = (id: string) => ({
  to: { pathname: "/subscribers", search: `?${VIEW_PARAM}=${id}` },
  // opened from the app - closing can simply go back
  state: { fromApp: true },
});

export const useSubscriberPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const viewId = searchParams.get(VIEW_PARAM);

  const open = (id: string) => {
    const { to, state } = subscriberPanelLink(id);
    // another subscriber while the panel is open - replace, do not stack
    navigate(to, { state, replace: Boolean(viewId) });
  };

  const close = () => {
    if ((location.state as { fromApp?: boolean } | null)?.fromApp) {
      navigate(-1);
      return;
    }

    setSearchParams(
      (params) => {
        params.delete(VIEW_PARAM);
        return params;
      },
      { replace: true }
    );
  };

  return { viewId, open, close };
};
