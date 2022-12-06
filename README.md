# slow-zone

[![Build status](https://img.shields.io/circleci/project/github/banterability/slow-zone/main.svg)](https://circleci.com/gh/banterability/slow-zone/tree/main) [![Latest published version](https://img.shields.io/npm/v/slow-zone.svg)](https://www.npmjs.com/package/slow-zone)

A client & wrapper for CTA 'L' arrival data.

## Installation

```bash
$ npm install slow-zone
```

## Usage

Make sure you have a [CTA Train Tracker API Key][1].

```javascript
const SlowZone = require("slow-zone");

const client = new SlowZone({ apiKey: "afafafafafafafafafafafafafafafaf" });
```

### Arrivals

#### `getArrivalsForStation(stationId, options)`

| Key         | Value                                                                                                             | Required? |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| `stationId` | (Integer) A CTA station ID. See the [CTA API Documentation][2] for valid values.                                  | Yes       |
| `options`   | (Object) Additional key/value pairs to pass through to API. See the [CTA API documentation][2] for valid options. | No        |

Returns a Promise that either resolves with an array of objects, each describing a predicted train, or rejects with an error.

```javascript
// Logan Square: 41020
client.getArrivalsForStation(41020, {})
  .then(arrivals => /* do something */)
  .catch(err => /* do something */);
```

#### `getArrivalsForStop(stopId, options)`

| Key       | Value                                                                                                             | Required? |
| --------- | ----------------------------------------------------------------------------------------------------------------- | --------- |
| `stopId`  | (Integer) A CTA stop ID. See the [CTA API Documentation][2] for valid values.                                     | Yes       |
| `options` | (Object) Additional key/value pairs to pass through to API. See the [CTA API documentation][2] for valid options. | No        |

Returns a Promise that either resolves with an array of objects, each describing a predicted train, or rejects with an error.

```javascript
// Merchandise Mart, Southbound Platform: 30091
// Example uses options to only return Brown Line trains
client.getArrivalsForStop(30091, {rt: "Brn"})
  .then(arrivals => /* do something */)
  .catch(err => /* do something */);
```

### Follow This Train

#### `followTrain(runId)`

| Key     | Value                                                                                  | Required? |
| ------- | -------------------------------------------------------------------------------------- | --------- |
| `runId` | (Integer) A train run ID. Likely something you got from one of the above API requests. | Yes       |

Returns a Promise that either resolves with an array of objects, each describing a station stop, or rejects with an error.

```javascript
sz.followTrain(410)
  .then(arrivals => /* do something */)
  .catch(err => /* do something */);
```

### Response Structure

Slow Zone reformats and decorates the response from the CTA API to speed up common tasks. Note that all fields may not be present on all responses.

```json
{
  "destination": {
    "id": 30182,
    "name": "Midway"
  },
  "location": {
    "latitude": 41.87685,
    "longitude": -87.6327,
    "heading": 269
  },
  "prediction": {
    "arrivalMinutes": 1,
    "arrivalString": "2:50 p.m.",
    "arrivalTime": "2014-10-07T21:50:27.000Z",
    "predictionAge": 3531786,
    "predictionTime": "2014-10-07T21:49:27.000Z"
  },
  "route": {
    "class": "orange",
    "directionId": 5,
    "id": "Org",
    "name": "Orange",
    "run": 715
  },
  "station": {
    "id": 40160,
    "name": "LaSalle/Van Buren",
    "stop": {
      "id": 30031,
      "description": "Service at Inner Loop platform"
    }
  },
  "status": {
    "approaching": true,
    "delayed": false,
    "faulty": false,
    "scheduled": false
  }
}
```

#### Destination

Data about the final destination of the predicted train:

| Key                | Value                                                          |
| ------------------ | -------------------------------------------------------------- |
| `destination.id`   | (Integer) The GTFS station ID of the final destination station |
| `destination.name` | (String) The name of the final destination station             |

#### Location

Data about the predicted train's current location:

| Key                  | Value                                      |
| -------------------- | ------------------------------------------ |
| `location.latitude`  | (Float) The current latitude of the train  |
| `location.longitude` | (Float) The current longitude of the train |
| `location.heading`   | (Integer) The current heading of the train |

#### Prediction

The prediction itself, in a number of formats:

| Key                         | Value                                                                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `prediction.arrivalMinutes` | (Integer) The number of minutes until the train arrives at the station, rounded to the nearest minute                                         |
| `prediction.arrivalString`  | (String) A user-friendly string of the time a train is expected to arrive. Formatted by [Dateline](https://github.com/banterability/dateline) |
| `prediction.arrivalTime`    | (Date) The date & time the train is predicted to arrive at the station                                                                        |
| `prediction.predictionAge`  | (Integer) The number of seconds that have elapsed since the prediction was made                                                               |
| `prediction.predictionTime` | (Date) The date & time when the prediction was generated                                                                                      |

#### Route

Data about the predicted train's route:

| Key                 | Value                                                                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `route.class`       | (String) The name of the route, lowercased for consistency                                                                                     |
| `route.directionId` | (Integer) The directionality of the run. See the documentation for specifics, but as a general rule `1` is north & west, `5` is south and east |
| `route.id`          | (String) The CTA ID for the route                                                                                                              |
| `route.name`        | (String) The name (color) of the route                                                                                                         |
| `route.run`         | (Integer) A unique (that day) identifier for the run                                                                                           |

#### Station

Data about the station the prediction is relative to:

| Key                        | Value                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `station.id`               | (Integer) The GTFS station ID of the station the prediction is relative to                                           |
| `station.name`             | (String) The name of the station the prediction is relative to                                                       |
| `station.stop.id`          | (Integer) The GTFS stop ID of the stop the prediction is relative to                                                 |
| `station.stop.description` | (String) A description of the stop the prediction is relative to. Usually in the format "Service at \_\_\_ platform" |

#### Status

Flags that may affect the reliability or display
context of a prediction:

| Key                  | Value                                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `status.approaching` | (Boolean) Indicates that a train is approaching the station                                                                               |
| `status.delayed`     | (Boolean) Indicates that a train has not reached the next waypoint by the time the prediction expected and it may no longer be accurate   |
| `status.faulty`      | (Boolean) Indicates an issue with the train tracker system that prevents a prediction from being made                                     |
| `status.scheduled`   | (Boolean) Indicates that a prediction is based on the preset schedule, not a train in motion. Frequently seen at the start & end of lines |

## Development

| Command       | Description          |
| ------------- | -------------------- |
| `npm install` | Install dependencies |
| `npm test`    | Run tests            |

[1]: http://www.transitchicago.com/developers/traintrackerapply.aspx
[2]: http://www.transitchicago.com/assets/1/developer_center/cta_Train_Tracker_API_documentation_v1_42.pdf
