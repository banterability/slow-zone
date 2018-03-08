const nock = require("nock");

const SlowZone = require("../../lib");
const {getMock} = require("../mocks");

describe("client", () => {
  test("responds with error when API key is invalid", done => {
    nock.load(getMock("bad-api-key"));

    const client = new SlowZone({apiKey: "invalid-api-key"});

    client.arrivals.byStation(40160, {}, (err, body) => {
      expect(err.toString()).toBe("Error: 101 – Invalid API key");
      expect(body).toBeUndefined();

      done();
    });
  });

  test("responds with error when passing invalid parameters", done => {
    nock.load(getMock("bad-station-id"));

    const client = new SlowZone({apiKey: "api-key"});

    client.arrivals.byStation("bad-id", {}, (err, body) => {
      expect(err.toString()).toBe("Error: 103 – Invalid mapid: bad-id");
      expect(body).toBeUndefined();

      done();
    });
  });
});
