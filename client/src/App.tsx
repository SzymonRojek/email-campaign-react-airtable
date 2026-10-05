import { AxiosError } from "axios";
import { QueryClient, QueryCache, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "react-toastify/dist/ReactToastify.min.css";

import { ToastContainer } from "react-toastify";

import { AppContainer } from "./AppContainer";
import { toastMessage } from "./helpers";
import { getErrorMessage } from "./services";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // no point to retry when the user is logged out
      retry: (failureCount, error) =>
        (error as AxiosError).response?.status !== 401 && failureCount < 3,
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
    <div className="page-container">
      <QueryClientProvider client={queryClient}>
        <AppContainer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </div>
  );
};

export default App;
