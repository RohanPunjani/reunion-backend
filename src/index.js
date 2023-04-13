const app = require("./app");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log("Something went Wrong while connecting to the database:!"));

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
