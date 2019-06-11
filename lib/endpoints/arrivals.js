const ENDPOINT = "ttarrivals.aspx";

module.exports = client => {
  return {
    arrivals: {
      byStop: (stopId, options = {}) => {
        options.stpid = stopId;
        return client.fetch(ENDPOINT, options);
      },
      byStation: (stationId, options = {}) => {
        options.mapid = stationId;
        return client.fetch(ENDPOINT, options);
      }
    }
  };
};
