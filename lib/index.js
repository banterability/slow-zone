const {extend} = require("underscore");
const request = require("request");
const VERSION = require("../package.json").version;

const Train = require("./presenters/train");

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

  fetch(endpoint, queryParams, callback) {
    const defaultQueryParams = {
      key: this.apiKey,
      outputType: "json"
    };

    const apiOptions = {
      qs: {...queryParams, ...defaultQueryParams},
      uri: `${this.baseUrl}/${endpoint}`,
      json: true,
      headers: {
        "User-Agent": `slow-zone/v${VERSION}`
      }
    };

    request(apiOptions, function(err, res, body) {
      if (err) return callback(err);

      if (body.ctatt.errCd != "0") {
        return callback(new Error(`${body.ctatt.errCd} – ${body.ctatt.errNm}`));
      }

      const results = body.ctatt.eta.map(trainData =>
        new Train(trainData).toHash()
      );

      callback(null, results);
    });
  }
}

module.exports = SlowZone;
