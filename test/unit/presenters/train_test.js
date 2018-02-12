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
      test("returns true if train is approaching", () => {
        const t = trainWithAttributes({isApp: "1"});

        expect(t.isApproaching()).toBe(true);
      });

      test("returns false if train is not approaching", () => {
        const t = trainWithAttributes({isApp: "0"});

        expect(t.isApproaching()).toBe(false);
      });
    });

    describe("isDelayed", () => {
      test("returns true if train is delayed", () => {
        const t = trainWithAttributes({isDly: "1"});

        expect(t.isDelayed()).toBe(true);
      });

      test("returns false if train is not delayed", () => {
        const t = trainWithAttributes({isDly: "0"});

        expect(t.isDelayed()).toBe(false);
      });
    });

    describe("isFaulty", () => {
      test("returns true if train is faulty", () => {
        const t = trainWithAttributes({isFlt: "1"});

        expect(t.isFaulty()).toBe(true);
      });

      test("returns false if train is not faulty", () => {
        const t = trainWithAttributes({isFlt: "0"});

        expect(t.isFaulty()).toBe(false);
      });
    });

    describe("isScheduled", () => {
      test("returns true if train is scheduled", () => {
        const t = trainWithAttributes({isSch: "1"});

        expect(t.isScheduled()).toBe(true);
      });

      test("returns false if train is not scheduled", () => {
        const t = trainWithAttributes({isSch: "0"});

        expect(t.isScheduled()).toBe(false);
      });
    });
  });

  describe("date fields", () => {
    describe("arrivalTime", () => {
      test("returns a native Date object", () => {
        const t = trainWithAttributes({arrT: "20141007 14:50:27"});
        const expected = new Date(2014, 9, 7, 14, 50, 27);
        const actual = t.arrivalTime();

        expect(actual.getTime()).toBe(expected.getTime());
      });
    });

    describe("predictionTime", () => {
      test("returns a native Date object", () => {
        const t = trainWithAttributes({prdt: "20141007 14:49:27"});
        const expected = new Date(2014, 9, 7, 14, 49, 27);
        const actual = t.predictionTime();

        expect(actual.getTime()).toBe(expected.getTime());
      });
    });
  });

  describe("floating point fields", () => {
    test("converts latitude to a float", () => {
      const t = trainWithAttributes({lat: "41.87685"});

      expect(t.latitude()).toBe(41.87685);
    });

    test("converts longitude to a float", () => {
      const t = trainWithAttributes({lon: "-87.6327"});

      expect(t.longitude()).toBe(-87.6327);
    });
  });

  describe("generated fields", () => {
    describe("arrivalMinutes", () => {
      test("converts time difference to minutes", () => {
        const t = trainWithStubbedMethod([
          {
            arrivalTime: new Date(2014, 1, 1, 12, 5, 0),
            predictionTime: new Date(2014, 1, 1, 12, 0, 0)
          }
        ]);

        expect(t.arrivalMinutes()).toBe(5);
      });

      test("rounds down at < 30 seconds", () => {
        const t = trainWithStubbedMethod([
          {
            arrivalTime: new Date(2014, 1, 1, 12, 1, 29),
            predictionTime: new Date(2014, 1, 1, 12, 0, 0)
          }
        ]);

        expect(t.arrivalMinutes()).toBe(1);
      });

      test("rounds up at > 30 seconds", () => {
        const t = trainWithStubbedMethod([
          {
            arrivalTime: new Date(2014, 1, 1, 12, 1, 31),
            predictionTime: new Date(2014, 1, 1, 12, 0, 0)
          }
        ]);

        expect(t.arrivalMinutes()).toBe(2);
      });
    });

    describe("arrivalString", () => {
      test("calls Dateline for formatting", () => {
        const testTime = new Date();
        const t = trainWithStubbedMethod([{arrivalTime: testTime}]);
        const expected = Dateline(testTime).getAPTime();

        expect(t.arrivalString()).toBe(expected);
      });
    });

    describe("predictionAge", () => {
      beforeAll(() => {
        timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
      });

      afterAll(() => {
        timekeeper.reset();
      });

      test("returns seconds since prediction time", () => {
        const t = trainWithAttributes({prdt: "20141007 14:49:27"});

        expect(t.predictionAge()).toBe(90);
      });
    });

    describe("route", () => {
      describe("sets friendly name for abbreviated routes", () => {
        test("handles the Brown line", () => {
          const t = trainWithAttributes({rt: "Brn"});

          expect(t.route()).toBe("Brown");
        });

        test("handles the Green line", () => {
          const t = trainWithAttributes({rt: "G"});

          expect(t.route()).toBe("Green");
        });

        test("handles the Orange line", () => {
          const t = trainWithAttributes({rt: "Org"});

          expect(t.route()).toBe("Orange");
        });

        test("handles the Purple line", () => {
          const t = trainWithAttributes({rt: "P"});

          expect(t.route()).toBe("Purple");
        });

        test("handles the Yellow line", () => {
          const t = trainWithAttributes({rt: "Y"});

          expect(t.route()).toBe("Yellow");
        });
      });

      describe("passes through unabbreviated routes", () => {
        test("handles the Red line", () => {
          const t = trainWithAttributes({rt: "Red"});

          expect(t.route()).toBe("Red");
        });

        test("handles the Blue line", () => {
          const t = trainWithAttributes({rt: "Blue"});

          expect(t.route()).toBe("Blue");
        });

        test("handles the Pink line", () => {
          const t = trainWithAttributes({rt: "Pink"});

          expect(t.route()).toBe("Pink");
        });
      });
    });

    describe("routeClass", () => {
      test("handles the Brown line", () => {
        const t = trainWithAttributes({rt: "Brn"});

        expect(t.routeClass()).toBe("brown");
      });

      test("handles the Green line", () => {
        const t = trainWithAttributes({rt: "G"});

        expect(t.routeClass()).toBe("green");
      });

      test("handles the Orange line", () => {
        const t = trainWithAttributes({rt: "Org"});

        expect(t.routeClass()).toBe("orange");
      });

      test("handles the Purple line", () => {
        const t = trainWithAttributes({rt: "P"});

        expect(t.routeClass()).toBe("purple");
      });

      test("handles the Yellow line", () => {
        const t = trainWithAttributes({rt: "Y"});

        expect(t.routeClass()).toBe("yellow");
      });

      test("handles the Red line", () => {
        const t = trainWithAttributes({rt: "Red"});

        expect(t.routeClass()).toBe("red");
      });

      test("handles the Blue line", () => {
        const t = trainWithAttributes({rt: "Blue"});

        expect(t.routeClass()).toBe("blue");
      });

      test("handles the Pink line", () => {
        const t = trainWithAttributes({rt: "Pink"});

        expect(t.routeClass()).toBe("pink");
      });
    });
  });

  describe("integer fields", () => {
    test("converts destination station ID to an integer", () => {
      const t = trainWithAttributes({destSt: "30182"});

      expect(t.destinationId()).toBe(30182);
    });

    test("converts direction ID to an integer", () => {
      const t = trainWithAttributes({trDr: "5"});

      expect(t.directionId()).toBe(5);
    });

    test("converts heading to an integer", () => {
      const t = trainWithAttributes({heading: "269"});

      expect(t.heading()).toBe(269);
    });

    test("converts run number to an integer", () => {
      const t = trainWithAttributes({rn: "715"});

      expect(t.runNumber()).toBe(715);
    });

    test("converts station ID to an integer", () => {
      const t = trainWithAttributes({staId: "40160"});

      expect(t.stationId()).toBe(40160);
    });

    test("converts stop ID to an integer", () => {
      const t = trainWithAttributes({stpId: "30031"});

      expect(t.stopId()).toBe(30031);
    });
  });

  describe("string fields", () => {
    test("maps destination name", () => {
      const t = trainWithAttributes({destNm: "Midway"});

      expect(t.destinationName()).toBe("Midway");
    });

    test("maps route ID", () => {
      const t = trainWithAttributes({rt: "Org"});

      expect(t.routeId()).toBe("Org");
    });

    test("maps station name", () => {
      const t = trainWithAttributes({staNm: "LaSalle/Van Buren"});

      expect(t.stationName()).toBe("LaSalle/Van Buren");
    });

    test("maps stop description", () => {
      const t = trainWithAttributes({stpDe: "Service at Inner Loop platform"});

      expect(t.stopDescription()).toBe("Service at Inner Loop platform");
    });
  });
});
