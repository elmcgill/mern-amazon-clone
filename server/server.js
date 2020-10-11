const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

//Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

const port = 8080;

mongoose.connect("mongodb://localhost:27017/amazon-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.listen(port, () => console.log(`Server start on ${port}`));

module.exports = app;
