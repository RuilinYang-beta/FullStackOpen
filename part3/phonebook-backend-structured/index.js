/*
 * Entry point for the application.
 * This file initializes the server and starts listening for incoming requests.
 */
const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

const PORT = config.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
