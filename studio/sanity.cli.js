// Read by the Sanity command-line tool.
const config = require("../sanity.config.json");

module.exports = {
  api: { projectId: config.projectId || undefined, dataset: config.dataset },
  studioHost: config.studioHost,
};
