const Dateline = require("dateline");

const {getNativeDate} = require("./helpers");

class Prediction {
  constructor(attributes) {
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
      (this.arrivalTime() - this.predictionTime()) / (60 * 1000)
    );
  }

  arrivalString() {
    return Dateline(this.arrivalTime()).getAPTime({includeMinutes: true});
  }

  predictionAge() {
    return Math.round((new Date() - this.predictionTime()) / 1000);
  }

  toJSON() {
    return {
      arrivalMinutes: this.arrivalMinutes(),
      arrivalString: this.arrivalString(),
      arrivalTime: this.arrivalTime(),
      predictionAge: this.predictionAge(),
      predictionTime: this.predictionTime()
    };
  }
}

module.exports = Prediction;
