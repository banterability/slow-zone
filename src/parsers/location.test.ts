import { describe, test, expect } from "vitest";

import { parseLocation } from "./train.js";

import type {
  BooleanNumber,
  RouteId,
  TrainDirection,
} from "../types/responses.js";

const MOCK_ATTRIBUTES = {
  staId: "40160",
  stpId: "30031",
  staNm: "LaSalle/Van Buren",
  stpDe: "Service at Inner Loop platform",
  rn: "715",
  rt: "Org" as RouteId,
  destSt: "30182",
  destNm: "Midway",
  trDr: "5" as TrainDirection,
  prdt: "2014-10-07T14:49:27",
  arrT: "2014-10-07T14:50:27",
  isApp: "1" as BooleanNumber,
  isSch: "0" as BooleanNumber,
  isDly: "0" as BooleanNumber,
  isFlt: "0" as BooleanNumber,
  flags: "",
  lat: "41.87685",
  lon: "-87.6327",
  heading: "269",
};

const MOCK_POSITION = {
  lat: "41.92973",
  lon: "-87.70854",
  heading: "301",
};

const WITHOUT_COORDINATES = {
  ...MOCK_ATTRIBUTES,
  lat: undefined,
  lon: undefined,
  heading: undefined,
};

describe("Location", () => {
  test("uses the row's own coordinates", () => {
    const location = parseLocation(MOCK_ATTRIBUTES, MOCK_POSITION);

    expect(location).toStrictEqual({
      latitude: 41.87685,
      longitude: -87.6327,
      heading: 269,
    });
  });

  test("falls back to the train's position", () => {
    const location = parseLocation(WITHOUT_COORDINATES, MOCK_POSITION);

    expect(location).toStrictEqual({
      latitude: 41.92973,
      longitude: -87.70854,
      heading: 301,
    });
  });

  test("returns undefined without coordinates or a position", () => {
    expect(parseLocation(WITHOUT_COORDINATES)).toBeUndefined();
  });

  test("returns undefined when the position is incomplete", () => {
    const location = parseLocation(WITHOUT_COORDINATES, {
      ...MOCK_POSITION,
      heading: "",
    });

    expect(location).toBeUndefined();
  });
});
