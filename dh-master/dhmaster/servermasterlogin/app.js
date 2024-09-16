const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { join, dirname } = require("path");
dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

app.use(express.static(join(__dirname, "build")));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to Dental Guru app</h1>");
});

// PORT
const PORT = 4000;

// run listen
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
