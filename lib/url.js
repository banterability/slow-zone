const qs = require("querystring");

const buildQueryString = (options = {}) =>
  options ? `?${qs.stringify(options)}` : "";

const buildUrl = (baseUrl, endpoint, options) => {
  const reqUrl = `${baseUrl}/${endpoint}/${buildQueryString(options)}`;
  console.log("buildUrl", reqUrl);
  return reqUrl;
};

module.exports = {buildUrl};
