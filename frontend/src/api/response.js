export const unwrapPayload = (payload) => {
  if (payload == null) {
    return null;
  }

  if (typeof payload !== "object") {
    return payload;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "data")) {
    const dataValue = payload.data;
    if (dataValue !== undefined) {
      return dataValue;
    }
  }

  if (Object.prototype.hasOwnProperty.call(payload, "statusCode")) {
    const statusValue = payload.statusCode;
    if (typeof statusValue !== "number") {
      return statusValue;
    }
  }

  return payload;
};

export const extractMessage = (payload, fallback = "") => {
  if (!payload || typeof payload !== "object") {
    return fallback;
  }
  if (typeof payload.message === "string" && payload.message.length) {
    return payload.message;
  }
  if (
    Object.prototype.hasOwnProperty.call(payload, "data") &&
    payload.data &&
    typeof payload.data.message === "string"
  ) {
    return payload.data.message;
  }
  return fallback;
};

export const unwrapAxiosResponse = (axiosResponse) => {
  const payload = axiosResponse?.data ?? axiosResponse;
  return unwrapPayload(payload);
};

export const buildErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error?.response?.data) {
    const responsePayload = error.response.data;
    const messageFromPayload = extractMessage(responsePayload);
    if (messageFromPayload) {
      return messageFromPayload;
    }
    if (typeof responsePayload === "string") {
      return responsePayload;
    }
  }
  if (error?.message) {
    return error.message;
  }
  return "Request failed";
};
