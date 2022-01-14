export function buildUrl(baseUrl, endpoint, options) {
  const requestUrl = new URL(`${baseUrl}/${endpoint}`);
  requestUrl.search = new URLSearchParams(options).toString();
  return requestUrl.toString();
}
