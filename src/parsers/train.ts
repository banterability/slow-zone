import { DateTime } from "luxon";

import type { TrainResponse } from "../types/responses.js";

export function parseTrain(attributes: TrainResponse) {
  return {
    destination: parseDestination(attributes),
    location: parseLocation(attributes),
    prediction: parsePrediction(attributes),
    route: parseRoute(attributes),
    station: parseStation(attributes),
    status: parseStatus(attributes),
  };
}

export function parseStatus({ isApp, isDly, isFlt, isSch }: TrainResponse) {
  return {
    approaching: asBoolean(isApp),
    delayed: asBoolean(isDly),
    faulty: asBoolean(isFlt),
    scheduled: asBoolean(isSch),
  };
}

export function parseStation({ staId, stpId, staNm, stpDe }: TrainResponse) {
  return {
    id: asInteger(staId),
    name: staNm,
    stop: {
      id: asInteger(stpId),
      description: stpDe,
    },
  };
}

export function parseLocation({ lat, lon, heading }: TrainResponse) {
  if (lat && lon && heading) {
    return {
      latitude: asFloat(lat),
      longitude: asFloat(lon),
      heading: asInteger(heading),
    };
  } else {
    return;
  }
}

const ABBREVIATED_ROUTE_NAMES = {
  Brn: "Brown",
  G: "Green",
  Org: "Orange",
  P: "Purple",
  Y: "Yellow",
};

export function parseRoute({ rn, rt, trDr }: TrainResponse) {
  const routeName =
    ABBREVIATED_ROUTE_NAMES[rt as keyof typeof ABBREVIATED_ROUTE_NAMES] || rt;

  return {
    class: routeName.toLowerCase(),
    directionId: asInteger(trDr),
    id: rt,
    name: routeName,
    run: asInteger(rn),
  };
}

export function parsePrediction({ arrT, prdt }: TrainResponse) {
  const arrivalTime = asDate(arrT);
  const arrivalDt = DateTime.fromJSDate(arrivalTime);
  const predictionTime = asDate(prdt);
  const predictionDt = DateTime.fromJSDate(predictionTime);

  const predictionAge = Math.round(arrivalDt.diff(predictionDt).as("seconds"));
  const arrivalMinutes = Math.round(arrivalDt.diff(predictionDt).as("minutes"));
  const arrivalString = arrivalDt.toLocaleString(DateTime.TIME_SIMPLE);

  return {
    arrivalMinutes: arrivalMinutes,
    arrivalString: arrivalString,
    arrivalTime: arrivalTime,
    predictionAge: predictionAge,
    predictionTime: predictionTime,
  };
}

export function parseDestination({ destSt, destNm }: TrainResponse) {
  return {
    id: asInteger(destSt),
    name: destNm,
  };
}

export function asBoolean(booleanString: string): boolean {
  return asInteger(booleanString) === 1;
}

export function asDate(timeString: string): Date {
  const matches = timeString.match(
    /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
  );

  if (!matches) throw new Error("Not a date string");

  const [year, month, day, hour, min, sec] = matches
    .slice(1)
    .map((value) => parseInt(value, 10));

  return new Date(year, month - 1, day, hour, min, sec);
}

export function asFloat(floatString: string): number {
  return parseFloat(floatString);
}

export function asInteger(integerString: string): number {
  return parseInt(integerString, 10);
}
