ENDPOINT = 'ttfollow.aspx'

module.exports = (client) ->
  follow:
    train: (runId, callback) ->
      client.fetch ENDPOINT, {runnumber: runId}, callback
