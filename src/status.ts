import { getNativeBoolean } from "./helpers";

export  class Status {
  attributes: TrainResponse;

  constructor(attributes) {
    this.attributes = attributes;
  }

  isApproaching() {
    return getNativeBoolean(this.attributes.isApp);
  }

  isDelayed() {
    return getNativeBoolean(this.attributes.isDly);
  }

  isFaulty() {
    return getNativeBoolean(this.attributes.isFlt);
  }

  isScheduled() {
    return getNativeBoolean(this.attributes.isSch);
  }

  toJSON() {
    return {
      approaching: this.isApproaching(),
      delayed: this.isDelayed(),
      faulty: this.isFaulty(),
      scheduled: this.isScheduled(),
    };
  }
}
