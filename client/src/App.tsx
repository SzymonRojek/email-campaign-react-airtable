import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ToastContainer } from "react-toastify";

import { AppContainer } from "./AppContainer";
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
    onError: (error, query) =>
      toastMessage(
        `${
          query.meta?.myMessage ?? "Something wrong - can not get data:"
        } ${getErrorMessage(error)}`
      ),
  }),
});

const App = () => {
  /*
  onError: (error, query) => {
    if (query.state.data === undefined) {
      toastMessage(`${query.meta?.myMessage} ${error.message}`),
    }
  },
  */
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppContainer />
        <ThemedToastContainer />

        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
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
