const path = require("path");

const getMock = scenarioName =>
  path.resolve(process.cwd(), `test/mocks/${scenarioName}.json`);

module.exports = {getMock};
