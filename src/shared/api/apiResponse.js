export function unwrapApiResponse(response, fallbackMessage = 'Request failed') {
  if (!response || typeof response !== 'object' || !('status' in response)) {
    return response;
  }

  if (response.status !== '200') {
    throw new Error(response.message || fallbackMessage);
  }

  return response.data;
}
