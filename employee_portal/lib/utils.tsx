const errorRequestHandler = (error: any) => {
  if (error.response) {
    if (error.response.status === 400) {
      return {
        success: false,
        errorMessage: error.response.data.error,
        errorData: error.response.data.message[0],
      };
    } else {
      return {
        success: false,
        errorMessage: error.response.data.message ?? error.response.data.error,
        errorData: [],
      };
    }
  } else {
    return {
      success: false,
      errorMessage: error.message,
      errorData: [],
    };
  }
};

export default function refreshSession() {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const event = new Event("visibilitychange");
    document.dispatchEvent(event);
  }
}

export { errorRequestHandler };
