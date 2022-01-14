import {getNativeFloat, getNativeInteger} from "./helpers";

export class Location {
  attributes: TrainResponse;

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
