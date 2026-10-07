import { toast } from "react-toastify";

// toastId: the same id shows one toast instead of a pile of them
const toastMessage = (error: string, toastId?: string) => {
  toast.error(error, {
    toastId,
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default toastMessage;
