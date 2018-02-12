const timekeeper = require("timekeeper");
const {loadJSONMock} = require("../../helpers");

const Train = require("../../../lib/presenters/train");

const mockTrain = loadJSONMock("train.json");

describe("Train", () => {
  beforeAll(() => {
    timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
  });

  afterAll(() => {
    timekeeper.reset();
  });

  describe("given a train's attributes", () => {
    let train;

    beforeAll(() => {
      train = new Train(mockTrain).toHash();
    });

    describe("destination station (headsign)", () => {
      test("presents the destination station ID", () => {
        expect(train.destination.id).toBe(30182);
      });

      test("presents the destination station name", () => {
        expect(train.destination.name).toBe("Midway");
      });
    });

    describe("location", () => {
      test("presents the train's current latitude", () => {
        expect(train.location.latitude).toBe(41.87685);
      });

      test("presents the train's current longitude", () => {
        expect(train.location.longitude).toBe(-87.6327);
      });

      test("presents the train's current heading", () => {
        expect(train.location.heading).toBe(269);
      });
    });

    describe("prediction", () => {
      test("presents the number of minutes between the prediction time and the arrival time", () => {
        expect(train.prediction.arrivalMinutes).toBe(1);
      });

      test("presents the arrival time as a human-readable string", () => {
        expect(train.prediction.arrivalString).toBe("2:50 p.m.");
      });

      test("presents the arrival time as a native JS date", () => {
        const expected = new Date(2014, 9, 7, 14, 50, 27).getTime();

        expect(train.prediction.arrivalTime.getTime()).toBe(expected);
      });

      test("presents the number of seconds since the predicion was generated", () => {
        expect(train.prediction.predictionAge).toBe(90);
      });
      test("presents the original prediction time as a native JS date", () => {
        const expected = new Date(2014, 9, 7, 14, 49, 27).getTime();

        expect(train.prediction.predictionTime.getTime()).toBe(expected);
      });
    });

    describe("route (line)", () => {
      test("presents the route direction ID", () => {
        expect(train.route.directionId).toBe(5);
      });

      test("presents the route ID", () => {
        expect(train.route.id).toBe("Org");
      });

      test("presents the human-readable route name", () => {
        expect(train.route.name).toBe("Orange");
      });

      test("presents the run number", () => {
        expect(train.route.run).toBe(715);
      });
    });

    describe("prediction station (this stop)", () => {
      test("presents the prediction station ID", () => {
        expect(train.station.id).toBe(40160);
      });

      test("presents the prediction station name", () => {
        expect(train.station.name).toBe("LaSalle/Van Buren");
      });

      describe("prediction stop", () => {
        test("presents the prediction stop ID", () => {
          expect(train.station.stop.id).toBe(30031);
        });

        test("presents the prediction stop description", () => {
          expect(train.station.stop.description).toBe(
            "Service at Inner Loop platform"
          );
        });
      });
    });

    describe("status", () => {
      test("presents whether the train is approaching", () => {
        expect(train.status.approaching).toBe(true);
      });

      test("presents whether the train is delayed", () => {
        expect(train.status.delayed).toBe(false);
      });

      test("presents whether the train is faulty", () => {
        expect(train.status.faulty).toBe(false);
      });

      test("presents whether the train is scheduled", () => {
        expect(train.status.scheduled).toBe(false);
      });
    });
  });
});
