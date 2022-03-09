import { QueryClient, QueryCache, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import toast, { Toaster } from "react-hot-toast";

import { AppContainer } from "./AppContainer";
import { useInformationModalState } from "./contexts/InformationModalContext";

const App = () => {
  // const { setInformationModalState, setInformationModalText } =
  //   useInformationModalState();

  // const informationModalProps = {
  //   colorButton: "error",
  //   onClose: () => {
  //     setInformationModalState({ isOpenInformationModal: false });
  //   },
  // };

  // const setErrorModal = (error) => {
  //   setInformationModalText({
  //     title: "ERROR",
  //     additionalText: "Check your internet connection",
  //     message: `${error}`,
  //   });
  //   setInformationModalState({
  //     informationModalProps,
  //     isOpenInformationModal: true,
  //   });
  // };

  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.state.data === undefined) {
          // setErrorModal(error.message);
          toast.error(`${query.meta?.myMessage} ${error.message}`);
        }
      },
    }),
  });

  return (
    <div className="page-container">
      <QueryClientProvider client={queryClient}>
        <AppContainer />

        <Toaster position="top-center" />
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    </div>
  );
};

export default App;
