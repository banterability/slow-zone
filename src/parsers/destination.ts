import { getNativeInteger } from "./helpers";
import type { TrainResponse } from "../types/responses";

export class Destination {
  attributes: TrainResponse;

  constructor(attributes: TrainResponse) {
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
