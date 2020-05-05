const {getNativeInteger} = require("./helpers");

class Destination {
  constructor(attributes) {
    this.attributes = attributes;
  }

  destinationId() {
    return getNativeInteger(this.attributes.destSt);
  }

  toJSON() {
    return {
      id: this.destinationId(),
      name: this.attributes.destNm,
    };
  }
}

module.exports = Destination;
