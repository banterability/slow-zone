import { getNativeInteger } from "./helpers";

export class Destination {
  attributes: TrainResponse;

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
