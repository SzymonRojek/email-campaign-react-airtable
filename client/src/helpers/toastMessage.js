import { toast } from "react-toastify";

const toastMessage = (error) => {
  toast.error(error, {
    position: "top-center",
    autoClose: true,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default toastMessage;
