import fetch from "node-fetch";

import { buildUrl } from "./url";
import {Train} from "./train";

const BASE_URL = "http://lapi.transitchicago.com/api/1.0";
const VERSION = require("../package.json").version;
const USER_AGENT = `slow-zone/v${VERSION}`;

export class SlowZone {
  apiKey: string;

  constructor(options) {
    this.apiKey = options.apiKey;
  }

  getArrivalsForStation(stationId, options = {}) {
    return this.getArrivals({mapid: stationId, ...options});
  }

  getArrivalsForStop(stopId, options = {}) {
    return this.getArrivals({stpid: stopId, ...options});
  }

  followTrain(runId) {
    return this.fetch("ttfollow.aspx", {runnumber: runId});
  }

  // Private API
  private fetch(endpoint, queryParams) {
    const defaultQueryParams = {
      key: this.apiKey,
      outputType: "json",
    };

    return fetch(
      buildUrl(BASE_URL, endpoint, {
        ...queryParams,
        ...defaultQueryParams,
      }),
      {
        headers: {"User-Agent": USER_AGENT},
      }
    )
      .then((res) => res.json())
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  private getArrivals(options) {
    return this.fetch("ttarrivals.aspx", options);
  }

  private handleSuccess(body) {
    return new Promise((resolve, reject) => {
      if (body.ctatt.errCd != "0") {
        return reject(new Error(`${body.ctatt.errCd} – ${body.ctatt.errNm}`));
      }

      const results = body.ctatt.eta.map((trainData) =>
        new Train(trainData).toJSON()
      );

      resolve(results);
    });
  }

  private handleError(err) {
    return Promise.reject(err);
  }
}

module.exports = SlowZone;