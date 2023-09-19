const express = require("express");
const createError = require("http-errors");
require("express-async-errors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRouter = require("./src/auth/auth.routes");
const userRouter = require("./src/users/users.routes");
const taskRouter = require("./src/task/task.route");
dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("APP IS RUNNING");
});
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  console.log(err.stack);
  res.status(err.status || 500).send(err.message);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
