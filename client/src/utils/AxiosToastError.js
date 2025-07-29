import toast from "react-hot-toast"

const AxiosToastError = (error) => {
  const message =
    error?.response?.data?.message || // custom backend error
    error?.message ||                 // generic axios error
    "Something went wrong";          // fallback

  toast.error(message);
};

export default AxiosToastError