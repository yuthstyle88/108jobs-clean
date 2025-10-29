import useNotification from "@/hooks/ui/useNotification";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useHandleFetchError(error: any) {
  const {errorMessage} = useNotification();

  if (!error) return null;

  let errorMsg = "";

  if (error?.code === "ECONNABORTED") {
    errorMsg = "Connection took too long, please try again.";
  } else if (!navigator.onLine) {
    errorMsg = "No network connection, please check again.";
  } else if (!error?.response) {
    errorMsg = "Unable to connect to server. Please try again later.";
  } else {
    errorMsg = "An unknown error occurred.";
  }

  errorMessage(null,
    null,
    errorMsg);

  return errorMsg;
}
