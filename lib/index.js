"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlowZone = void 0;
const node_fetch_1 = require("node-fetch");
const url_1 = require("./url");
const train_1 = require("./train");
const BASE_URL = "http://lapi.transitchicago.com/api/1.0";
const VERSION = require("../package.json").version;
const USER_AGENT = `slow-zone/v${VERSION}`;
class SlowZone {
    constructor(options) {
        this.apiKey = options.apiKey;
    }
    getArrivalsForStation(stationId, options = {}) {
        return this.getArrivals(Object.assign({ mapid: stationId }, options));
    }
    getArrivalsForStop(stopId, options = {}) {
        return this.getArrivals(Object.assign({ stpid: stopId }, options));
    }
    followTrain(runId) {
        return this.fetch("ttfollow.aspx", { runnumber: runId });
    }
    // Private API
    fetch(endpoint, queryParams) {
        const defaultQueryParams = {
            key: this.apiKey,
            outputType: "json",
        };
        return (0, node_fetch_1.default)((0, url_1.buildUrl)(BASE_URL, endpoint, Object.assign(Object.assign({}, queryParams), defaultQueryParams)), {
            headers: { "User-Agent": USER_AGENT },
        })
            .then((res) => res.json())
            .then(this.handleSuccess)
            .catch(this.handleError);
    }
    getArrivals(options) {
        return this.fetch("ttarrivals.aspx", options);
    }
    handleSuccess(body) {
        return new Promise((resolve, reject) => {
            if (body.ctatt.errCd != "0") {
                return reject(new Error(`${body.ctatt.errCd} – ${body.ctatt.errNm}`));
            }
            const results = body.ctatt.eta.map((trainData) => new train_1.Train(trainData).toJSON());
            resolve(results);
        });
    }
    handleError(err) {
        return Promise.reject(err);
    }
}
exports.SlowZone = SlowZone;
module.exports = SlowZone;
