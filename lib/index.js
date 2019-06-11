const {extend, isArray, map} = require("underscore");
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
      qs: extend({}, queryParams, defaultQueryParams),
      uri: `${this.baseUrl}/${endpoint}`,
      json: true,
      headers: {
        "User-Agent": `slow-zone/v${VERSION}`
      }
    };

    request(apiOptions, function(err, res, body) {
      if (err != null) {
        return callback(err);
      }

      const result = body;

      var ref, ref1, trainData;

      if (
        (result != null
          ? (ref = result.ctatt) != null
            ? ref.errCd
            : void 0
          : void 0) !== "0"
      ) {
        return callback(
          new Error(`${result.ctatt.errCd} – ${result.ctatt.errNm}`)
        );
      }

      const predictions = (ref1 = result.ctatt) != null ? ref1.eta : void 0;

      if (!predictions) {
        return callback(err, []);
      }

      if (!isArray(predictions)) {
        predictions = [predictions];
      }

      const response = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = predictions.length; i < len; i++) {
          trainData = predictions[i];
          results.push(new Train(trainData).toHash());
        }
        return results;
      })();

      callback(err, response);
    });
  }
}

module.exports = SlowZone;
