import { getNativeFloat, getNativeInteger } from "./helpers";
import type { TrainResponse } from "../types/responses";

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
    if (this.latitude() && this.longitude() && this.heading()) {
      return {
        latitude: this.latitude(),
        longitude: this.longitude(),
        heading: this.heading(),
      };
    } else {
      return;
    }
  }
}
