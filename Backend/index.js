const express = require("express");
const { connection } = require("./Config/db");
const { userRouter } = require("./Routes/userRouter");
require('dotenv').config()

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to DoubtShare Backend");
});

app.use("/user", userRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err);
    console.log("Not Connected to DB");
  }
  console.log(`Server is running at ${port}`);
});
