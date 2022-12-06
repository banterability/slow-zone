const { Route } = require("../dist/route");

describe("route", () => {
  describe("sets friendly name for abbreviated routes", () => {
    test("handles the Brown line", () => {
      const route = new Route({ rt: "Brn" });

      expect(route.route()).toBe("Brown");
    });

    test("handles the Green line", () => {
      const route = new Route({ rt: "G" });

      expect(route.route()).toBe("Green");
    });

    test("handles the Orange line", () => {
      const route = new Route({ rt: "Org" });

      expect(route.route()).toBe("Orange");
    });

    test("handles the Purple line", () => {
      const route = new Route({ rt: "P" });

      expect(route.route()).toBe("Purple");
    });

    test("handles the Yellow line", () => {
      const route = new Route({ rt: "Y" });

      expect(route.route()).toBe("Yellow");
    });
  });

  describe("passes through unabbreviated routes", () => {
    test("handles the Red line", () => {
      const route = new Route({ rt: "Red" });

      expect(route.route()).toBe("Red");
    });

    test("handles the Blue line", () => {
      const route = new Route({ rt: "Blue" });

      expect(route.route()).toBe("Blue");
    });

    test("handles the Pink line", () => {
      const route = new Route({ rt: "Pink" });

      expect(route.route()).toBe("Pink");
    });
  });
});
