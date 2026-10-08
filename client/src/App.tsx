import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ToastContainer } from "react-toastify";
import { createHashRouter, RouterProvider } from "react-router";

import { AppContainer } from "./AppContainer";
import { trackPage } from "./analytics";
import RouteError from "./components/RouteError";
import { appRoutes, publicRoutes } from "./Routing";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { toastMessage } from "./helpers";
import { getErrorMessage, HttpError } from "./services";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // no point to retry when the user is logged out
      retry: (failureCount, error) =>
        !(error instanceof HttpError && error.status === 401) &&
        failureCount < 3,
    },
  },
  queryCache: new QueryCache({
    // the first load failed: the page itself shows the error with "Try again" -
    // a toast only when a refresh in the background failed (old data on the screen),
    // and one toast for all queries (the dashboard loads two at once)
    onError: (error, query) => {
      // a query with meta.silent is a nice extra (e.g. the feedback) - no toast for it
      if (query.state.data === undefined || query.meta?.silent) return;

      toastMessage(
        `Could not refresh the data: ${getErrorMessage(error)}`,
        "query-refresh-error"
      );
    },
  }),
});

// a data router (not <HashRouter>) - needed for useBlocker (unsaved changes);
// the addresses keep the "#" like before
// a page that fails to render shows RouteError (and is reported) instead of a blank screen
const router = createHashRouter([
  { element: <AppContainer />, children: appRoutes, errorElement: <RouteError /> },
  ...publicRoutes.map((route) => ({ ...route, errorElement: <RouteError /> })),
]);

// visit statistics: one page view for every new page (not for "?view=..." panels)
let trackedPath = router.state.location.pathname;
trackPage(trackedPath);
router.subscribe(({ location }) => {
  if (location.pathname === trackedPath) return;
  trackedPath = location.pathname;
  trackPage(trackedPath);
});

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ThemedToastContainer />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

// the toasts follow the light / dark theme
const ThemedToastContainer = () => {
  const { resolvedTheme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={resolvedTheme}
    />
  );
};

export default App;
