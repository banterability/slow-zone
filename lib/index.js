const fetch = require("node-fetch");

const {buildUrl} = require("./url");
const Train = require("./presenters/train");

const VERSION = require("../package.json").version;
const USER_AGENT = `slow-zone/v${VERSION}`;

class SlowZone {
  constructor(options) {
    this.apiKey = options.apiKey;
    this.baseUrl = "http://lapi.transitchicago.com/api/1.0";
  }

  // Public API
  getArrivalsForStation(stationId, options = {}) {
    return this._getArrivals({mapid: stationId, ...options});
  }

  getArrivalsForStop(stopId, options = {}) {
    return this._getArrivals({stpid: stopId, ...options});
  }

  followTrain(runId) {
    return this._fetch("ttfollow.aspx", {runnumber: runId});
  }

  // Private API
  _fetch(endpoint, queryParams) {
    const defaultQueryParams = {
      key: this.apiKey,
      outputType: "json"
    };

    return fetch(
      buildUrl(this.baseUrl, endpoint, {
        ...queryParams,
        ...defaultQueryParams
      }),
      {
        headers: {"User-Agent": USER_AGENT}
      }
    )
      .then(res => res.json())
      .then(this._handleSuccess)
      .catch(this._handleError);
  }

  _getArrivals(options) {
    return this._fetch("ttarrivals.aspx", options);
  }

  _handleSuccess(body) {
    return new Promise((resolve, reject) => {
      if (body.ctatt.errCd != "0") {
        return reject(new Error(`${body.ctatt.errCd} – ${body.ctatt.errNm}`));
      }

      const results = body.ctatt.eta.map(trainData =>
        new Train(trainData).toHash()
      );

      resolve(results);
    });
  }

  _handleError(err) {
    return Promise.reject(err);
  }
}

module.exports = SlowZone;
