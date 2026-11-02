import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import { type IncomingMessage } from "node:http";
import { request, type RequestOptions } from "node:https";

import { beforeEach, describe, expect, test, vi } from "vitest";

import SlowZone, { VERSION } from "./index.js";

vi.mock("node:https", () => ({
  request: vi.fn(),
}));

const mockRequest = vi.mocked(request);

const FOLLOW_RESPONSE = {
  ctatt: {
    tmst: "2026-09-10T17:14:43",
    errCd: "0",
    errNm: null,
    position: { lat: "41.92973", lon: "-87.70854", heading: "301" },
    eta: [
      {
        staId: "40060",
        stpId: "30012",
        staNm: "Belmont",
        stpDe: "Service toward O'Hare",
        rn: "222",
        rt: "Blue Line",
        destSt: "30171",
        destNm: "O'Hare",
        trDr: "1",
        prdt: "2026-09-10T17:14:12",
        arrT: "2026-09-10T17:16:12",
        isApp: "0",
        isSch: "0",
        isDly: "0",
        isFlt: "0",
        flags: null,
      },
      {
        staId: "41240",
        stpId: "30239",
        staNm: "Addison",
        stpDe: "Service toward O'Hare",
        rn: "222",
        rt: "Blue Line",
        destSt: "30171",
        destNm: "O'Hare",
        trDr: "1",
        prdt: "2026-09-10T17:14:12",
        arrT: "2026-09-10T17:17:12",
        isApp: "0",
        isSch: "0",
        isDly: "0",
        isFlt: "0",
        flags: null,
      },
    ],
  },
};

const ARRIVALS_RESPONSE = {
  ctatt: {
    tmst: "2026-09-10T17:14:14",
    errCd: "0",
    errNm: null,
    eta: [
      {
        staId: "41020",
        stpId: "30197",
        staNm: "Logan Square",
        stpDe: "Service toward O'Hare",
        rn: "222",
        rt: "Blue",
        destSt: "30171",
        destNm: "O'Hare",
        trDr: "1",
        prdt: "2026-09-10T17:14:02",
        arrT: "2026-09-10T17:15:02",
        isApp: "1",
        isSch: "0",
        isDly: "0",
        isFlt: "0",
        flags: null,
        lat: "41.92906",
        lon: "-87.70745",
        heading: "301",
      },
      {
        staId: "41020",
        stpId: "30197",
        staNm: "Logan Square",
        stpDe: "Service toward O'Hare",
        rn: "228",
        rt: "Blue",
        destSt: "30171",
        destNm: "O'Hare",
        trDr: "1",
        prdt: "2026-09-10T17:13:57",
        arrT: "2026-09-10T17:15:57",
        isApp: "0",
        isSch: "0",
        isDly: "0",
        isFlt: "0",
        flags: null,
        lat: "41.92194",
        lon: "-87.69689",
        heading: "301",
      },
    ],
  },
};

function respondWith(body: unknown) {
  const implementation = (
    _options: RequestOptions,
    callback: (res: IncomingMessage) => void,
  ) => {
    const res = new EventEmitter() as IncomingMessage;
    res.statusCode = 200;
    callback(res);
    res.emit("data", Buffer.from(JSON.stringify(body)));
    res.emit("end");

    return { on: vi.fn(), end: vi.fn() } as unknown as ReturnType<
      typeof request
    >;
  };

  mockRequest.mockImplementation(implementation as typeof request);
}

describe("SlowZone", () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  test("VERSION matches package.json", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf-8"),
    );
    expect(VERSION).toBe(pkg.version);
  });

  test("sends a User-Agent header with the package version", () => {
    const mockReq = { on: vi.fn(), end: vi.fn() } as unknown as ReturnType<
      typeof request
    >;
    mockRequest.mockReturnValue(mockReq);

    const client = new SlowZone({ apiKey: "test-key" });
    void client.getArrivalsForStation(41020);

    expect(mockRequest).toHaveBeenCalledOnce();
    const options = mockRequest.mock.calls[0][0] as RequestOptions;
    expect(options.headers?.["User-Agent"]).toBe(`slow-zone/${VERSION}`);
  });

  test("followTrain gives every stop the train's position", async () => {
    respondWith(FOLLOW_RESPONSE);

    const client = new SlowZone({ apiKey: "test-key" });
    const arrivals = await client.followTrain("222");

    const options = mockRequest.mock.calls[0][0] as RequestOptions;
    expect(options.path).toContain("ttfollow.aspx");
    expect(options.path).toContain("runnumber=222");

    expect(arrivals).toHaveLength(2);
    for (const arrival of arrivals) {
      expect(arrival.location).toStrictEqual({
        latitude: 41.92973,
        longitude: -87.70854,
        heading: 301,
      });
    }
  });

  test("getArrivalsForStation keeps each train's own location", async () => {
    respondWith(ARRIVALS_RESPONSE);

    const client = new SlowZone({ apiKey: "test-key" });
    const arrivals = await client.getArrivalsForStation(41020);

    const options = mockRequest.mock.calls[0][0] as RequestOptions;
    expect(options.path).toContain("ttarrivals.aspx");
    expect(options.path).toContain("mapid=41020");

    expect(arrivals.map((arrival) => arrival.location)).toStrictEqual([
      { latitude: 41.92906, longitude: -87.70745, heading: 301 },
      { latitude: 41.92194, longitude: -87.69689, heading: 301 },
    ]);
  });
});
