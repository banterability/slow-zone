import { parseRoute } from "./train";

const MOCK_ATTRIBUTES = {
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
};

describe("route", () => {
  describe("sets friendly name for abbreviated routes", () => {
    test("handles the Brown line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "Brn" }).name;

      expect(route).toBe("Brown");
    });

    test("handles the Green line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "G" }).name;

      expect(route).toBe("Green");
    });

    test("handles the Orange line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "Org" }).name;

      expect(route).toBe("Orange");
    });

    test("handles the Purple line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "P" }).name;

      expect(route).toBe("Purple");
    });

    test("handles the Yellow line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "Y" }).name;

      expect(route).toBe("Yellow");
    });
  });

  describe("passes through unabbreviated routes", () => {
    test("handles the Red line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "Red" }).name;

      expect(route).toBe("Red");
    });

    test("handles the Blue line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "Blue" }).name;

      expect(route).toBe("Blue");
    });

    test("handles the Pink line", () => {
      const route = parseRoute({ ...MOCK_ATTRIBUTES, rt: "Pink" }).name;

      expect(route).toBe("Pink");
    });
  });
});
