const {getNativeFloat, getNativeInteger} = require("./helpers");

class Location {
  constructor(attributes) {
    this.attributes = attributes;
  }

  latitude() {
    return getNativeFloat(this.attributes.lat);
  }

  longitude() {
    return getNativeFloat(this.attributes.lon);
  }

  heading() {
    return getNativeInteger(this.attributes.heading);
  }

  toJSON() {
    return {
      latitude: this.latitude(),
      longitude: this.longitude(),
      heading: this.heading(),
    };
  }
}

module.exports = Location;
