const Dateline = require("dateline");
const timekeeper = require("timekeeper");

const { Prediction } = require("../dist/parsers/prediction");

const stubbedPrediction = ([stubbedMethods]) => {
  const p = new Prediction();
  for (let method in stubbedMethods) {
    let returnValue = stubbedMethods[method];
    jest.spyOn(p, method).mockReturnValue(returnValue);
  }
  return p;
};

describe("Prediction", () => {
  beforeAll(() => {
    timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
  });

  afterAll(() => {
    timekeeper.reset();
  });

  describe("arrivalTime", () => {
    test("returns a native Date object", () => {
      const prediction = new Prediction({ arrT: "2014-10-07T14:50:27" });
      const expected = new Date(2014, 9, 7, 14, 50, 27);
      const actual = prediction.arrivalTime();

      expect(actual.getTime()).toBe(expected.getTime());
    });
  });

  describe("predictionTime", () => {
    test("returns a native Date object", () => {
      const prediction = new Prediction({ prdt: "2014-10-07T14:49:27" });
      const expected = new Date(2014, 9, 7, 14, 49, 27);
      const actual = prediction.predictionTime();

      expect(actual.getTime()).toBe(expected.getTime());
    });
  });

  describe("arrivalMinutes", () => {
    test("converts time difference to minutes", () => {
      const p = stubbedPrediction([
        {
          arrivalTime: new Date(2014, 1, 1, 12, 5, 0),
          predictionTime: new Date(2014, 1, 1, 12, 0, 0),
        },
      ]);

      expect(p.arrivalMinutes()).toBe(5);
    });

    test("rounds down at < 30 seconds", () => {
      const p = stubbedPrediction([
        {
          arrivalTime: new Date(2014, 1, 1, 12, 1, 29),
          predictionTime: new Date(2014, 1, 1, 12, 0, 0),
        },
      ]);

      expect(p.arrivalMinutes()).toBe(1);
    });

    test("rounds up at > 30 seconds", () => {
      const p = stubbedPrediction([
        {
          arrivalTime: new Date(2014, 1, 1, 12, 1, 31),
          predictionTime: new Date(2014, 1, 1, 12, 0, 0),
        },
      ]);

      expect(p.arrivalMinutes()).toBe(2);
    });
  });

  describe("arrivalString", () => {
    test("calls Dateline for formatting", () => {
      const testTime = new Date();
      const p = stubbedPrediction([{ arrivalTime: testTime }]);
      const expected = Dateline(testTime).getAPTime();

      expect(p.arrivalString()).toBe(expected);
    });
  });

  describe("predictionAge", () => {
    test("returns seconds since prediction time", () => {
      const p = new Prediction({ prdt: "2014-10-07T14:49:27" });

      expect(p.predictionAge()).toBe(90);
    });
  });
});
