const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const api = require("./routes");

app.use(express.json());

app.use(
  cors({
    origin: [process.env.ADMIN_APP_URL],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use("/api", api);

app.listen(5000, (err) => {
  if (err) {
    process.exit(1);
  } else {
    console.log(`Express server listening on ${port}`);
  }
});
