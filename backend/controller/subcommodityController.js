// const partNumberModule = require('../module/partNumberModule');
const subcommodityModule = require("../module/subCommodityModule");

module.exports = {
  addSubCommodity: (req, res) => {
    const subcommodityContent = req.body;
    console.log(subcommodityContent);
    subcommodityModule.subcommodityCollection
      .findOne({ subcommodity: subcommodityContent.code })
      .then((data) => {
        if (data) {
          if (data.subcommodity === "F") {
            const final = {
              index: 0,
              Definition: subcommodityContent.Definition,
              revisedBy: subcommodityContent.revisedBy,
              revisionDate: new Date(), // Set the current date for revisionDate
            };
            data.CrossEntry = [final];
            return data
              .save()
              .then(() =>
                res.status(200).send("Final Subcommodity is created")
              );
          }

          if (data.CrossEntry.length > 100) {
            // Limit reached, do not add more entries
            res.send({ status: "Maximum limit reached" });
          } else {
            // Adding new CrossEntry
            const CrossEntry = {
              index: data.CrossEntry.length + 1,
              Definition: subcommodityContent.Definition,
              revisedBy: subcommodityContent.revisedBy,
              revisionDate: new Date(), // Set the current date for revisionDate
            };
            data.CrossEntry.push(CrossEntry);
          }
          return data.save();
        } else {
          // Handle case where subcommodity with given code is not found
          throw new Error("Subcommodity not found");
        }
      })
      .then(() => {
        console.log("CrossEntry updated or added successfully");
        res
          .status(200)
          .send({ status: "CrossEntry updated or added successfully" });
      })
      .catch((err) => {
        console.error("Error:", err.message);
        res.status(500).send({ status: "Error: " + err.message });
      });
  },

  getSubCommodity: (req, res) => {
    const subcommodityCode = req.body.code;
    subcommodityModule.subcommodityCollection
      .findOne({ subcommodity: subcommodityCode })
      .then((subcommodity) => {
        if (subcommodity) {
          res.send(subcommodity.CrossEntry);
        } else {
          res.status(404).send({ error: "Subcommodity not found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send({ error: "Internal Server Error" });
      });
  },
};
