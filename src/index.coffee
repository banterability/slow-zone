{extend, isArray, map} = require 'underscore'
request = require 'request'
Train = require './presenters/train'
xml2js = require 'xml2js'

xmlParser = new xml2js.Parser explicitArray: false

class SlowZone
  constructor: (options) ->
    @baseUrl = 'http://lapi.transitchicago.com/api/1.0'
    @apiKey = options.apiKey
    @registerEndpoints namespace for namespace in ['arrivals', 'follow']

  registerEndpoints: (namespace) ->
    endpoint = require("./endpoints/#{namespace}")(this)
    extend this, endpoint

  fetch: (endpoint, queryParams, callback) ->
    defaultQueryParams =
      key: @apiKey

    apiOptions =
      qs: extend {}, queryParams, defaultQueryParams
      uri: "#{@baseUrl}/#{endpoint}"

    request apiOptions, (err, res, body) ->
      return callback err if err?

      xmlParser.parseString body, (err, result) ->
        if result?.ctatt?.errCd != "0"
          return callback new Error "#{result.ctatt.errCd} – #{result.ctatt.errNm}"

        predictions = result.ctatt?.eta
        return callback err, [] unless predictions

        predictions = [predictions] unless isArray(predictions)
        response = ((new Train trainData).toHash() for trainData in predictions)
        callback err, response

module.exports = SlowZone
