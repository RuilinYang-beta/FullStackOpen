const config = require("./utils/config");
const app = require("./app");

const port = config.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
