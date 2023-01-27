const timekeeper = require("timekeeper");

import { parsePrediction } from "./train.js";
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

describe("Prediction", () => {
  beforeAll(() => {
    timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
  });

  afterAll(() => {
    timekeeper.reset();
  });

  describe("arrivalTime", () => {
    test("returns a Date", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        arrT: "2014-10-07T14:50:27",
      });

      expect(prediction.arrivalTime).toStrictEqual(
        new Date(2014, 9, 7, 14, 50, 27)
      );
    });
  });

  describe("predictionTime", () => {
    test("returns a Date", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        prdt: "2014-10-07T14:49:27",
      });

      expect(prediction.predictionTime).toStrictEqual(
        new Date(2014, 9, 7, 14, 49, 27)
      );
    });
  });

  describe("arrivalMinutes", () => {
    test("converts time difference to minutes", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        arrT: "2014-02-01T12:05:00",
        prdt: "2014-02-01T12:00:00",
      });

      expect(prediction.arrivalMinutes).toBe(5);
    });

    test("rounds down at < 30 seconds", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        arrT: "2014-02-01T12:01:29",
        prdt: "2014-02-01T12:00:00",
      });

      expect(prediction.arrivalMinutes).toBe(1);
    });

    test("rounds up at > 30 seconds", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        arrT: "2014-02-01T12:01:31",
        prdt: "2014-02-01T12:00:00",
      });

      expect(prediction.arrivalMinutes).toBe(2);
    });
  });

  describe("arrivalString", () => {
    test("formats as DateTime.TIME_SIMPLE", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        arrT: "2022-12-06T16:36:05",
      });
      expect(prediction.arrivalString).toBe("4:36 PM");
    });
  });

  describe("predictionAge", () => {
    test("returns seconds since prediction time", () => {
      const prediction = parsePrediction({
        ...MOCK_ATTRIBUTES,
        arrT: "2014-10-07T14:50:27",
        prdt: "2014-10-07T14:49:27",
      });

      expect(prediction.predictionAge).toBe(60);
    });
  });
});
