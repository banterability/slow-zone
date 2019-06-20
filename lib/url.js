const qs = require("querystring");

const buildQueryString = (options = {}) =>
  options ? `?${qs.stringify(options)}` : "";

const buildUrl = (baseUrl, endpoint, options) => {
  const requestUrl = new URL(`${baseUrl}/${endpoint}`);
  requestUrl.search = buildQueryString(options);
  return requestUrl;
};

module.exports = {buildUrl};
