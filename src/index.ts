import { request } from "node:https";
import { Train } from "./parsers/train";
import { CTAResponse } from "./types/responses";

const API_BASE_URL = "lapi.transitchicago.com";
const API_BASE_PATH = "/api/1.0";

export class SlowZone {
  apiKey: string;

  constructor(options) {
    this.apiKey = options.apiKey;
  }

  getArrivalsForStation(stationId, options = {}) {
    return this.getArrivals({ ...options, mapid: stationId });
  }

  getArrivalsForStop(stopId, options = {}) {
    return this.getArrivals({ ...options, stpid: stopId });
  }

  followTrain(runId) {
    return this.makeRequest("ttfollow.aspx", { runnumber: runId });
  }

  private getArrivals(options) {
    return this.makeRequest("ttarrivals.aspx", options);
  }

  private async makeRequest(endpoint: string, queryParams = {}) {
    const query = new URLSearchParams({
      ...queryParams,
      key: this.apiKey,
      outputType: "json",
    });

    const options = {
      hostname: API_BASE_URL,
      port: 443,
      path: `${API_BASE_PATH}/${endpoint}?${query.toString()}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "slow-zone/v3.0.0-beta1",
      },
    };

    return new Promise(function (resolve, reject) {
      const req = request(options, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(res.statusCode.toString()));
        }

        let body = [],
          json;

        res.on("data", (chunk) => {
          body.push(chunk);
        });

        res.on("end", () => {
          try {
            json = JSON.parse(Buffer.concat(body).toString());
          } catch (e) {
            return reject(e);
          }
          return resolve(json);
        });
      });

      req.on("error", (err) => {
        reject(err);
      });

      req.end();
    }).then((body: CTAResponse) => {
      return new Promise((resolve, reject) => {
        if (body.ctatt.errCd != "0") {
          return reject(new Error(`[${body.ctatt.errCd}] ${body.ctatt.errNm}`));
        }

        resolve(
          body.ctatt.eta.map((trainData) => new Train(trainData).toJSON())
        );
      });
    });
  }
}

module.exports = SlowZone;
