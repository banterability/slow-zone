const Destination = require("./Destination");
const Location = require("./Location");
const Prediction = require("./Prediction");
const Route = require("./Route");
const Station = require("./Station");
const Status = require("./Status");

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
      status: new Status(this.attributes).toJSON()
    };
  }
}

module.exports = Train;
