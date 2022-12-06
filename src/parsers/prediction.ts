import Dateline from "dateline";
import { getNativeDate } from "./helpers";
import type { TrainResponse } from "../types/responses";

export class Prediction {
  attributes: TrainResponse;

  constructor(attributes: TrainResponse) {
    this.attributes = attributes;
  }

  arrivalTime() {
    return getNativeDate(this.attributes.arrT);
  }

  predictionTime() {
    return getNativeDate(this.attributes.prdt);
  }

  arrivalMinutes() {
    return Math.round(
      (this.arrivalTime().getTime() - this.predictionTime().getTime()) /
        (60 * 1000)
    );
  }

  arrivalString() {
    return Dateline(this.arrivalTime()).getAPTime({ includeMinutes: true });
  }

  predictionAge() {
    return Math.round(
      (new Date().getTime() - this.predictionTime().getTime()) / 1000
    );
  }

  toJSON() {
    return {
      arrivalMinutes: this.arrivalMinutes(),
      arrivalString: this.arrivalString(),
      arrivalTime: this.arrivalTime(),
      predictionAge: this.predictionAge(),
      predictionTime: this.predictionTime(),
    };
  }
}
