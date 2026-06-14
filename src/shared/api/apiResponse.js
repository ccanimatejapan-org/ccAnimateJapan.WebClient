export class ApiResponseError extends Error {
  constructor(message, apiStatus) {
    super(message);
    this.name = 'ApiResponseError';
    this.apiStatus = apiStatus;
  }
}

export function unwrapApiResponse(response, fallbackMessage = 'Request failed') {
  if (!response || typeof response !== 'object' || !('status' in response)) {
    return response;
  }

  if (response.status !== '200') {
    throw new ApiResponseError(response.message || fallbackMessage, response.status);
  }

  return response.data;
}
