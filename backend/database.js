const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://Rohit.Agrawal:Rohitagr2610@127.0.0.1:27017/buildNumber?authSource=admin"
);

const con = mongoose.connection;

con.on("connected", () => {
  console.log("Database Connected");
});

con.on("error", () => {
  console.log("ERROR: While Connecting Database");
});

module.exports = con;
