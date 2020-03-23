const Destination = require("./destination");
const Location = require("./location");
const Prediction = require("./prediction");
const Route = require("./route");
const Station = require("./station");
const Status = require("./status");

class Train {
  constructor(attributes = {}) {
    this.attributes = attributes;
  }

  toJSON() {
    return {
      destination: new Destination(this.attributes).toJSON(),
      location: new Location(this.attributes).toJSON(),
      prediction: new Prediction(this.attributes).toJSON(),
      route: new Route(this.attributes).toJSON(),
      station: new Station(this.attributes).toJSON(),
      status: new Status(this.attributes).toJSON(),
    };
  }
}

module.exports = Train;
