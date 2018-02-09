const ENDPOINT = "ttarrivals.aspx";

module.exports = client => {
  return {
    arrivals: {
      byStop: (stopId, options = {}, callback) => {
        options.stpid = stopId;
        return client.fetch(ENDPOINT, options, callback);
      },
      byStation: (stationId, options = {}, callback) => {
        options.mapid = stationId;
        return client.fetch(ENDPOINT, options, callback);
      }
    }
  };
};
