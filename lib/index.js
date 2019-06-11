const {extend} = require("underscore");
const request = require("request");
const fetch = require("node-fetch");
const querystring = require("querystring");
const {buildUrl} = require("./url");
const VERSION = require("../package.json").version;

const Train = require("./presenters/train");

const handleError = err => {
  Promise.reject(err);
};

const handleSuccess = result => {
  return new Promise((resolve, reject) => {
    if (body.ctatt.errCd != "0") {
      return reject(new Error(`${result.ctatt.errCd} – ${result.ctatt.errNm}`));
    }

    const results = body.ctatt.eta.map(trainData =>
      new Train(trainData).toHash()
    );

    resolve(results);
  });
};

class SlowZone {
  constructor(options) {
    this.apiKey = options.apiKey;
    this.baseUrl = "http://lapi.transitchicago.com/api/1.0";

    ["arrivals", "follow"].forEach(namespace => {
      this.registerEndpoints(namespace);
    });
  }

  registerEndpoints(namespace) {
    const endpoint = require(`./endpoints/${namespace}`)(this);
    return extend(this, endpoint);
  }

  fetch(endpoint, queryParams) {
    const defaultQueryParams = {
      key: this.apiKey,
      outputType: "json"
    };

    return fetch(
      buildUrl(
        this.baseUrl,
        endpoint,
        extend({}, queryParams, defaultQueryParams)
      ),
      {
        headers: {"User-Agent": `slow-zone/v${VERSION}`}
      }
    )
      .then(res => res.json())
      .then(handleSuccess)
      .catch(handleError);
  }
}

module.exports = SlowZone;
