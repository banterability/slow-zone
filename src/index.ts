import { readFileSync } from "node:fs";
import { request } from "node:https";

import { parseTrain } from "./parsers/train.js";
import { APIResponse } from "./types/responses.js";

export type Arrival = ReturnType<typeof parseTrain>;

const API_BASE_URL = "lapi.transitchicago.com";
const API_BASE_PATH = "/api/1.0";
export const VERSION: string = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
).version;

export default class SlowZone {
  apiKey: string;

  constructor(options: { apiKey: string }) {
    this.apiKey = options.apiKey;
  }

  getArrivalsForStation(
    stationId: string | number,
    options = {},
  ): Promise<Arrival[]> {
    return this.getArrivals({ ...options, mapid: stationId });
  }

  getArrivalsForStop(
    stopId: string | number,
    options = {},
  ): Promise<Arrival[]> {
    return this.getArrivals({ ...options, stpid: stopId });
  }

  followTrain(runId: string | number): Promise<Arrival[]> {
    return this.fetch("ttfollow.aspx", { runnumber: runId });
  }

  private getArrivals(options = {}) {
    return this.fetch("ttarrivals.aspx", options);
  }

  private async fetch(endpoint: string, queryParams = {}): Promise<Arrival[]> {
    const resp = await this.makeRequest(endpoint, queryParams);
    if (!resp) {
      throw new Error("invalid response");
    }
    if (resp.ctatt.errCd != "0") {
      throw new Error(`[${resp.ctatt.errCd}] ${resp.ctatt.errNm}`);
    }
    return resp.ctatt.eta.map((trainData) => parseTrain(trainData));
  }

  private async makeRequest(
    endpoint: string,
    queryParams = {},
  ): Promise<APIResponse> {
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
        "User-Agent": `slow-zone/${VERSION}`,
      },
    };

    return new Promise(function (resolve, reject) {
      const req = request(options, (res) => {
        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          return reject(new Error(res.statusCode.toString()));
        }

        const body: Uint8Array[] = [];
        let json;

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
        return reject(err);
      });

      req.end();
    });
  }
}
