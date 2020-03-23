const {getNativeInteger} = require("./helpers");

class Route {
  constructor(attributes) {
    this.attributes = attributes;
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

  directionId() {
    return getNativeInteger(this.attributes.trDr);
  }

  runNumber() {
    return getNativeInteger(this.attributes.rn);
  }

  routeClass() {
    return this.route().toLowerCase();
  }

  routeId() {
    return this.attributes.rt;
  }

  toJSON() {
    return {
      class: this.routeClass(),
      directionId: this.directionId(),
      id: this.routeId(),
      name: this.route(),
      run: this.runNumber(),
    };
  }
}

module.exports = Route;
