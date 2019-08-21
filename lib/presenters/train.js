const Dateline = require("dateline");

const {
  getNativeBoolean,
  getNativeDate,
  getNativeFloat,
  getNativeInteger
} = require("./helpers");

const STRING_FIELDS = {
  destNm: "destinationName",
  rt: "routeId",
  staNm: "stationName",
  stpDe: "stopDescription"
};

class Train {
  constructor(attributes = {}) {
    var attributeName, methodName;
    this.attributes = attributes;
    // Map string fields that don't need additional processing
    for (attributeName in STRING_FIELDS) {
      methodName = STRING_FIELDS[attributeName];
      this[methodName] = (function(value) {
        return function() {
          return value;
        };
      })(this.attributes[attributeName]);
    }
  }

  // Boolean Fields
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

  // Date Fields
  arrivalTime() {
    return getNativeDate(this.attributes.arrT);
  }

  predictionTime() {
    return getNativeDate(this.attributes.prdt);
  }

  // Floating Point Fields
  latitude() {
    return getNativeFloat(this.attributes.lat);
  }

  longitude() {
    return getNativeFloat(this.attributes.lon);
  }

  // Generated Fields
  arrivalMinutes() {
    return Math.round(
      (this.arrivalTime() - this.predictionTime()) / (60 * 1000)
    );
  }

  arrivalString() {
    return Dateline(this.arrivalTime()).getAPTime();
  }

  predictionAge() {
    return Math.round((new Date() - this.predictionTime()) / 1000);
  }

  route() {
    var route;
    switch ((route = this.routeId())) {
      case "Brn":
        return "Brown";
      case "G":
        return "Green";
      case "Org":
        return "Orange";
      case "P":
        return "Purple";
      case "Y":
        return "Yellow";
      default:
        return route;
    }
  }

  routeClass() {
    return this.route().toLowerCase();
  }

  // Integer Fields
  destinationId() {
    return getNativeInteger(this.attributes.destSt);
  }

  directionId() {
    return getNativeInteger(this.attributes.trDr);
  }

  heading() {
    return getNativeInteger(this.attributes.heading);
  }

  runNumber() {
    return getNativeInteger(this.attributes.rn);
  }

  stationId() {
    return getNativeInteger(this.attributes.staId);
  }

  stopId() {
    return getNativeInteger(this.attributes.stpId);
  }

  // Output
  destinationJSON() {
    return {
      id: this.destinationId(),
      name: this.destinationName()
    };
  }

  locationJSON() {
    return {
      latitude: this.latitude(),
      longitude: this.longitude(),
      heading: this.heading()
    };
  }

  predictionJSON() {
    return {
      arrivalMinutes: this.arrivalMinutes(),
      arrivalString: this.arrivalString(),
      arrivalTime: this.arrivalTime(),
      predictionAge: this.predictionAge(),
      predictionTime: this.predictionTime()
    };
  }

  routeJSON() {
    return {
      class: this.routeClass(),
      directionId: this.directionId(),
      id: this.routeId(),
      name: this.route(),
      run: this.runNumber()
    };
  }

  stationJSON() {
    return {
      id: this.stationId(),
      name: this.stationName(),
      stop: {
        id: this.stopId(),
        description: this.stopDescription()
      }
    };
  }

  statusJSON() {
    return {
      approaching: this.isApproaching(),
      delayed: this.isDelayed(),
      faulty: this.isFaulty(),
      scheduled: this.isScheduled()
    };
  }

  toHash() {
    return {
      destination: this.destinationJSON(),
      location: this.locationJSON(),
      prediction: this.predictionJSON(),
      route: this.routeJSON(),
      station: this.stationJSON(),
      status: this.statusJSON()
    };
  }
}

module.exports = Train;
