const mongoose = require("mongoose");

const dbUrl =
  process.env.NODE_ENV === "production"
    ? "mongodb://Rohit.Agrawal:Rohitagr2610@127.0.0.1:27017/buildNumber?authSource=admin"
    : "mongodb://127.0.0.1:27017/buildNumber";

mongoose.connect(dbUrl);

const con = mongoose.connection;

con.on("connected", () => {
  console.log("Database Connected");
});

con.on("error", () => {
  console.log("ERROR: While Connecting Database");
});

module.exports = con;
