const {getNativeInteger} = require("./helpers");

class Destination {
  constructor(attributes) {
    this.attributes = attributes;
  }

  destinationId() {
    return getNativeInteger(this.attributes.destSt);
  }

  destinationName() {
    return this.attributes.destNm;
  }

  toJSON() {
    return {
      id: this.destinationId(),
      name: this.destinationName()
    };
  }
}

module.exports = Destination;
