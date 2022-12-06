import { Destination } from "./destination";
import { Location } from "./location";
import { Prediction } from "./prediction";
import { Route } from "./route";
import { Station } from "./station";
import { Status } from "./status";
import type { TrainResponse } from "../types/responses";

export class Train {
  attributes: TrainResponse;

  constructor(attributes) {
    this.attributes = attributes;
  }

  toJSON() {
    return {
      destination: new Destination(this.attributes).toJSON(),
      location: new Location(this.attributes).toJSON(),
      prediction: new Prediction(this.attributes).toJSON(),
      route: new Route(this.attributes).toJSON(),
      station: new Station(this.attributes).toJSON(),
      status: new Status(this.attributes).toJSON(),
    };
  }
}
