const {getNativeInteger} = require("./helpers");

class Station {
  constructor(attributes) {
    this.attributes = attributes;
  }

  stationId() {
    return getNativeInteger(this.attributes.staId);
  }

  stopId() {
    return getNativeInteger(this.attributes.stpId);
  }

  stopDescription() {
    return this.attributes.stpDe;
  }

  stationName() {
    return this.attributes.staNm;
  }

  toJSON() {
    return {
      id: this.stationId(),
      name: this.stationName(),
      stop: {
        id: this.stopId(),
        description: this.stopDescription()
      }
    };
  }
}

module.exports = Station;
