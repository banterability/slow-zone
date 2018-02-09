const ENDPOINT = "ttfollow.aspx";

module.exports = client => {
  return {
    follow: {
      train: (runId, callback) =>
        client.fetch(ENDPOINT, {runnumber: runId}, callback)
    }
  };
};
