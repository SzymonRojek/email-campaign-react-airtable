import { ReactNode } from "react";
import { toast } from "react-toastify";

// a short confirmation after saving - instead of a modal the user has to close
const toastSuccess = (message: ReactNode, autoClose = 4000) => {
  toast.success(message, {
    position: "top-center",
    autoClose,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export default toastSuccess;
