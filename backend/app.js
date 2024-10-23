const express = require("express");
const cors = require("cors");

const db = require("./database");
const router = require("./router/Routes");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", router);

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/editTables", (req, res) => {
  res.render("editTables");
});

app.listen(8000, () => console.log("Port 8000 is started"));
