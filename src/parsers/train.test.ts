const timekeeper = require("timekeeper");
import { parseTrain } from "./train";

const MOCK_TRAIN_JSON = JSON.stringify({
  staId: "40160",
  stpId: "30031",
  staNm: "LaSalle/Van Buren",
  stpDe: "Service at Inner Loop platform",
  rn: "715",
  rt: "Org",
  destSt: "30182",
  destNm: "Midway",
  trDr: "5",
  prdt: "2014-10-07T14:49:27",
  arrT: "2014-10-07T14:50:27",
  isApp: "1",
  isSch: "0",
  isDly: "0",
  isFlt: "0",
  flags: "",
  lat: "41.87685",
  lon: "-87.6327",
  heading: "269",
});

describe("Train", () => {
  describe("toJSON", () => {
    beforeAll(() => {
      timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
    });

    afterAll(() => {
      timekeeper.reset();
    });

    test("returns all attributes", () => {
      const train = parseTrain(JSON.parse(MOCK_TRAIN_JSON));

      expect(train).toMatchSnapshot();
    });
  });
});
