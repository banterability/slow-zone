import { getNativeInteger } from "./helpers";
import type { TrainResponse } from "../types/responses";

const ABBREVIATED_ROUTE_NAMES = {
  Brn: "Brown",
  G: "Green",
  Org: "Orange",
  P: "Purple",
  Y: "Yellow",
};

export class Route {
  attributes: TrainResponse;

  constructor(attributes) {
    this.attributes = attributes;
  }

  route() {
    return ABBREVIATED_ROUTE_NAMES[this.attributes.rt] || this.attributes.rt;
  }

  directionId() {
    return getNativeInteger(this.attributes.trDr);
  }

  runNumber() {
    return getNativeInteger(this.attributes.rn);
  }

  routeClass() {
    return this.route().toLowerCase();
  }

  toJSON() {
    return {
      class: this.routeClass(),
      directionId: this.directionId(),
      id: this.attributes.rt,
      name: this.route(),
      run: this.runNumber(),
    };
  }
}
