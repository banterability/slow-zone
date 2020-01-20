const bond = require("bondjs");
const Dateline = require("dateline");
const timekeeper = require("timekeeper");

const Train = require("../../../lib/presenters/train");
const mockTrain = require("../../mocks/mock_train.json");

describe("Train", () => {
  describe("toJSON", () => {
    beforeAll(() => {
      timekeeper.freeze(new Date(2014, 9, 7, 14, 50, 57));
    });

    afterAll(() => {
      timekeeper.reset();
    });

    test("returns all attributes", () => {
      const train = new Train(mockTrain).toJSON();

      expect(train).toMatchSnapshot();
    });
  });
});
