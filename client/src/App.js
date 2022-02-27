import { AppContainer } from "./AppContainer";
import { APIcontextProvider } from "contexts/APIcontextProvider";
import Modals from "./Modals";
import {
  QueryClient,
  QueryCache,
  QueryClientProvider,
  ReactQueryDevtools,
} from "react-query";

import { useInformationModalState } from "contexts/InformationModalContext";

const App = () => {
  const queryClient = new QueryClient();

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
  //     message: `${error.message}`,
  //   });
  //   setInformationModalState({
  //     informationModalProps,
  //     isOpenInformationModal: true,
  //   });
  // };

  // {
  //   queryCache: new QueryCache({
  //     onError: (error, query) => {
  //       // if (query.state.data === undefined) {
  //       setErrorModal(error);
  //       // console.log(query);
  //       // }
  //     },
  //   }
  // }

  return (
    <div className="page-container">
      <Modals>
        <QueryClientProvider client={queryClient}>
          <APIcontextProvider>
            <AppContainer />
          </APIcontextProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </Modals>
    </div>
  );
};

export default App;
