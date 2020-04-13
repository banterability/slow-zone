const {
  getNativeBoolean,
  getNativeFloat,
  getNativeInteger,
} = require("../../../lib/presenters/helpers");

describe("helpers", () => {
  describe("getNativeBoolean", () => {
    test("converts an string '1' to a native true", () => {
      expect(getNativeBoolean("1")).toBe(true);
    });

    test("converts a string '0' to a native false", () => {
      expect(getNativeBoolean("0")).toBe(false);
    });
  });

  describe("getNativeFloat", () => {
    test("converts an float string to a native float", () => {
      expect(getNativeFloat("123.45")).toBe(123.45);
    });
  });

  describe("getNativeInteger", () => {
    test("converts an integer string to a native integer", () => {
      expect(getNativeInteger("42")).toBe(42);
    });
  });
});
