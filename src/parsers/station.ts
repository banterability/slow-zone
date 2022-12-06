import { getNativeInteger } from "./helpers";
import type { TrainResponse } from "../types/responses";

export class Station {
  attributes: TrainResponse;

  constructor(attributes: TrainResponse) {
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
