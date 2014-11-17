ENDPOINT = 'ttarrivals.aspx'

module.exports = (client) ->
  arrivals:
    byStop: (stopId, options = {}, callback) ->
      options.stpid = stopId
      client.fetch ENDPOINT, options, callback

    byStation: (stationId, options = {}, callback) ->
      options.mapid = stationId
      client.fetch ENDPOINT, options, callback
