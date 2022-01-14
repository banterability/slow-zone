import { getNativeInteger } from "./helpers";

export class Station {
  attributes: TrainResponse;

  constructor(attributes) {
    this.attributes = attributes;
  }

  stationId() {
    return getNativeInteger(this.attributes.staId);
  }

  stopId() {
    return getNativeInteger(this.attributes.stpId);
  }

  toJSON() {
    return {
      id: this.stationId(),
      name: this.attributes.staNm,
      stop: {
        id: this.stopId(),
        description: this.attributes.stpDe,
      },
    };
  }
}
