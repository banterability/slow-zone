const assert = require("assertive");
const bond = require("bondjs");
const Dateline = require("dateline");
const timekeeper = require("timekeeper");

const Train = require("../../../lib/presenters/train");

const trainWithAttributes = attributes => new Train(attributes);

const trainWithStubbedMethod = function([stubbedMethods]) {
  const t = new Train();
  for (let method in stubbedMethods) {
    let returnValue = stubbedMethods[method];
    bond(t, method).return(returnValue);
  }
  return t;
};

describe("Train", () => {
  describe("boolean fields", () => {
    describe("isApproaching", () => {
      it("returns true if train is approaching", () => {
        const t = trainWithAttributes({isApp: "1"});

        assert.truthy(t.isApproaching());
      });

      it("returns false if train is not approaching", () => {
        const t = trainWithAttributes({isApp: "0"});

        assert.falsey(t.isApproaching());
      });
    });

    describe("isDelayed", () => {
      it("returns true if train is delayed", () => {
        const t = trainWithAttributes({isDly: "1"});

        assert.truthy(t.isDelayed());
      });

      it("returns false if train is not delayed", () => {
        const t = trainWithAttributes({isDly: "0"});

        assert.falsey(t.isDelayed());
      });
    });

    describe("isFaulty", () => {
      it("returns true if train is faulty", () => {
        const t = trainWithAttributes({isFlt: "1"});

        assert.truthy(t.isFaulty());
      });

      it("returns false if train is not faulty", () => {
        const t = trainWithAttributes({isFlt: "0"});

        assert.falsey(t.isFaulty());
      });
    });

    describe("isScheduled", () => {
      it("returns true if train is scheduled", () => {
        const t = trainWithAttributes({isSch: "1"});

        assert.truthy(t.isScheduled());
      });

      it("returns false if train is not scheduled", () => {
        const t = trainWithAttributes({isSch: "0"});

        assert.falsey(t.isScheduled());
      });
    });
  });

  describe("date fields", () => {
    describe("arrivalTime", () => {
      it("returns a native Date object", () => {
        const t = trainWithAttributes({arrT: "20141007 14:50:27"});
        const expected = new Date(2014, 9, 7, 14, 50, 27);
        const actual = t.arrivalTime();

        assert.hasType(Date, actual);
        assert.equal(expected.getTime(), actual.getTime());
      });
    });

    describe("predictionTime", () => {
      it("returns a native Date object", () => {
        const t = trainWithAttributes({prdt: "20141007 14:49:27"});
        const expected = new Date(2014, 9, 7, 14, 49, 27);
        const actual = t.predictionTime();

        assert.hasType(Date, actual);
        assert.equal(expected.getTime(), actual.getTime());
      });
    });
  });

  describe("floating point fields", () => {
    it("converts latitude to a float", () => {
      const t = trainWithAttributes({lat: "41.87685"});

      assert.equal(41.87685, t.latitude());
    });

    it("converts longitude to a float", () => {
      const t = trainWithAttributes({lon: "-87.6327"});

      assert.equal(-87.6327, t.longitude());
    });
  });

  describe("generated fields", () => {
    describe("arrivalMinutes", () => {
      it("converts time difference to minutes", () => {
        const t = trainWithStubbedMethod([
          {
            arrivalTime: new Date(2014, 1, 1, 12, 5, 0),
            predictionTime: new Date(2014, 1, 1, 12, 0, 0)
          }
        ]);

        assert.equal(5, t.arrivalMinutes());
      });

      it("rounds down at < 30 seconds", () => {
        const t = trainWithStubbedMethod([
          {
            arrivalTime: new Date(2014, 1, 1, 12, 1, 29),
            predictionTime: new Date(2014, 1, 1, 12, 0, 0)
          }
        ]);

        assert.equal(1, t.arrivalMinutes());
      });

      it("rounds up at > 30 seconds", () => {
        const t = trainWithStubbedMethod([
          {
            arrivalTime: new Date(2014, 1, 1, 12, 1, 31),
            predictionTime: new Date(2014, 1, 1, 12, 0, 0)
          }
        ]);

        assert.equal(2, t.arrivalMinutes());
      });
    });

    describe("arrivalString", () => {
      it("calls Dateline for formatting", () => {
        const testTime = new Date();
        const t = trainWithStubbedMethod([{arrivalTime: testTime}]);
        const expected = Dateline(testTime).getAPTime();

        assert.equal(expected, t.arrivalString());
      });
    });

    describe("predictionAge", () => {
      before(() => {
        timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
      });

      after(() => {
        timekeeper.reset();
      });

      it("returns seconds since prediction time", () => {
        const t = trainWithAttributes({prdt: "20141007 14:49:27"});

        assert.equal(90, t.predictionAge());
      });
    });

    describe("route", () => {
      describe("sets friendly name for abbreviated routes", () => {
        it("handles the Brown line", () => {
          const t = trainWithAttributes({rt: "Brn"});

          assert.equal("Brown", t.route());
        });

        it("handles the Green line", () => {
          const t = trainWithAttributes({rt: "G"});

          assert.equal("Green", t.route());
        });

        it("handles the Orange line", () => {
          const t = trainWithAttributes({rt: "Org"});

          assert.equal("Orange", t.route());
        });

        it("handles the Purple line", () => {
          const t = trainWithAttributes({rt: "P"});

          assert.equal("Purple", t.route());
        });

        it("handles the Yellow line", () => {
          const t = trainWithAttributes({rt: "Y"});

          assert.equal("Yellow", t.route());
        });
      });

      describe("passes through unabbreviated routes", () => {
        it("handles the Red line", () => {
          const t = trainWithAttributes({rt: "Red"});

          assert.equal("Red", t.route());
        });

        it("handles the Blue line", () => {
          const t = trainWithAttributes({rt: "Blue"});

          assert.equal("Blue", t.route());
        });

        it("handles the Pink line", () => {
          const t = trainWithAttributes({rt: "Pink"});

          assert.equal("Pink", t.route());
        });
      });
    });

    describe("routeClass", () => {
      it("handles the Brown line", () => {
        const t = trainWithAttributes({rt: "Brn"});

        assert.equal("brown", t.routeClass());
      });

      it("handles the Green line", () => {
        const t = trainWithAttributes({rt: "G"});

        assert.equal("green", t.routeClass());
      });

      it("handles the Orange line", () => {
        const t = trainWithAttributes({rt: "Org"});

        assert.equal("orange", t.routeClass());
      });

      it("handles the Purple line", () => {
        const t = trainWithAttributes({rt: "P"});

        assert.equal("purple", t.routeClass());
      });

      it("handles the Yellow line", () => {
        const t = trainWithAttributes({rt: "Y"});

        assert.equal("yellow", t.routeClass());
      });

      it("handles the Red line", () => {
        const t = trainWithAttributes({rt: "Red"});

        assert.equal("red", t.routeClass());
      });

      it("handles the Blue line", () => {
        const t = trainWithAttributes({rt: "Blue"});

        assert.equal("blue", t.routeClass());
      });

      it("handles the Pink line", () => {
        const t = trainWithAttributes({rt: "Pink"});

        assert.equal("pink", t.routeClass());
      });
    });
  });

  describe("integer fields", () => {
    it("converts destination station ID to an integer", () => {
      const t = trainWithAttributes({destSt: "30182"});

      assert.equal(30182, t.destinationId());
    });

    it("converts direction ID to an integer", () => {
      const t = trainWithAttributes({trDr: "5"});

      assert.equal(5, t.directionId());
    });

    it("converts heading to an integer", () => {
      const t = trainWithAttributes({heading: "269"});

      assert.equal(269, t.heading());
    });

    it("converts run number to an integer", () => {
      const t = trainWithAttributes({rn: "715"});

      assert.equal(715, t.runNumber());
    });

    it("converts station ID to an integer", () => {
      const t = trainWithAttributes({staId: "40160"});

      assert.equal(40160, t.stationId());
    });

    it("converts stop ID to an integer", () => {
      const t = trainWithAttributes({stpId: "30031"});

      assert.equal(30031, t.stopId());
    });
  });

  describe("string fields", () => {
    it("maps destination name", () => {
      const t = trainWithAttributes({destNm: "Midway"});

      assert.equal("Midway", t.destinationName());
    });

    it("maps route ID", () => {
      const t = trainWithAttributes({rt: "Org"});

      assert.equal("Org", t.routeId());
    });

    it("maps station name", () => {
      const t = trainWithAttributes({staNm: "LaSalle/Van Buren"});

      assert.equal("LaSalle/Van Buren", t.stationName());
    });

    it("maps stop description", () => {
      const t = trainWithAttributes({stpDe: "Service at Inner Loop platform"});

      assert.equal("Service at Inner Loop platform", t.stopDescription());
    });
  });
});
