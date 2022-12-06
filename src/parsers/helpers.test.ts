import { asBoolean, asFloat, asInteger } from "./train";

describe("helpers", () => {
  describe("asBoolean", () => {
    test("converts string '1' to true", () => {
      expect(asBoolean("1")).toBe(true);
    });

    test("converts string '0' to false", () => {
      expect(asBoolean("0")).toBe(false);
    });
  });

  describe("asFloat", () => {
    test("converts a string to a number", () => {
      expect(asFloat("123.45")).toBe(123.45);
    });
  });

  describe("asInteger", () => {
    test("converts a string to a number", () => {
      expect(asInteger("42")).toBe(42);
    });
  });
});
