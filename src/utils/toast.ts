import { toast } from "react-toastify";

export const toastSuccess = (message: string) => {
  toast.dismiss(); // 🔥 prevent stacking spam
  toast.success(message);
};

export const toastError = (message: string) => {
  toast.dismiss();
  toast.error(message);
};

export const toastInfo = (message: string) => {
  toast.dismiss();
  toast.info(message);
};