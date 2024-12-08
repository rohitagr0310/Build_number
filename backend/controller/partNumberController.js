const partNumberModule = require("../module/partNumberModule");
const partSlave = require("../module/partSlave");

module.exports = {
  addPartNumber: (req, res) => {
    const partNumberContent = req.body;
    const SubCommodity = parseInt(partNumberContent.subCommodity);
    const header = partNumberContent.header;
    const Commodity = partNumberContent.Commodity;
    const Part_No = parseInt(partNumberContent.Part_No);

    partNumberModule.partNumberCollection
      .findOne({
        code_header: header,
        code_Commodity: Commodity,
        code_SubCommodity: SubCommodity,
      })
      .then((data) => {
        if (data) {
          if (data.CrossEntry.length >= Part_No && Part_No) {
            const field = {
              header: header,
              Commodity: Commodity,
              SubCommodity: partNumberContent.subCommodity,
              Part_No: Part_No,
              revised_No: data.CrossEntry[Part_No - 1].revisionNumber + 1,
            };
            // Adding to Slave Collection
            const revision = {
              Definition: partNumberContent.Definition,
              revisionNumber: data.CrossEntry[Part_No - 1].revisionNumber, // New revision number
              revisedBy: partNumberContent.revisedBy,
            };
            partSlave.partNumberCollection
              .updateOne(
                {
                  code_header: header,
                  code_Commodity: Commodity,
                  code_SubCommodity: SubCommodity,
                  "CrossEntry.index": data.CrossEntry[Part_No - 1].index,
                },
                {
                  $push: { "CrossEntry.$.revisions": revision }, // Use $push to add the revision to the matched CrossEntry element
                }
              )
              .then((result) => {
                if (result.modifiedCount > 0) {
                  console.log("Revision updated or added successfully");
                  return res.status(200).send({
                    status: "Updated a part and made a new entry",
                  });
                } else {
                  // Handle case where the document or CrossEntry is not found
                  return res
                    .status(404)
                    .send({ status: "CrossEntry not found" });
                }
              })
              .catch((err) => {
                console.error("Error updating document:", err);
                return res
                  .status(500)
                  .send({ status: "Internal Server Error" });
              });
          } else if (Part_No > -1) {
            return res.status(200).send({ status: "Part no. doesn't exist" });
          } else {
            // Adding new CrossEntry
            const field = {
              header: header,
              Commodity: Commodity,
              SubCommodity: partNumberContent.subCommodity,
              Part_No: data.CrossEntry.length + 1,
              revised_No: 0, // Start with revision number 0 for new parts
            };

            const CrossEntrySlave = {
              index: data.CrossEntry.length + 1,
              revisions: [
                {
                  Definition: partNumberContent.Definition,
                  revisionNumber: 0,
                  revisedBy: partNumberContent.revisedBy,
                },
              ],
            };
            // Adding to Part Slave
            partSlave.partNumberCollection
              .findOne({
                code_header: header,
                code_Commodity: Commodity,
                code_SubCommodity: SubCommodity,
              })
              .then((slave) => {
                if (slave) {
                  console.log(CrossEntrySlave);
                  slave.CrossEntry.push(CrossEntrySlave);
                  slave.save();
                  return res.send({
                    status: "Added a new part",
                  });
                }
              });
          }
          return data.save();
        } else {
          // Handle case where subcommodity with given code is not found
          const newEntry = {
            code_header: header,
            code_Commodity: Commodity,
            code_SubCommodity: SubCommodity,
            CrossEntry: [
              {
                index: 1,
                Definition: partNumberContent.Definition,
                revisionNumber: 1,
                revisedBy: partNumberContent.revisedBy,
              },
            ],
          };

          const newEntrySlave = {
            code_header: header,
            code_Commodity: Commodity,
            code_SubCommodity: SubCommodity,
            CrossEntry: [
              {
                index: 1,
                revisions: [
                  {
                    Definition: partNumberContent.Definition,
                    revisionNumber: 1,
                    revisedBy: partNumberContent.revisedBy,
                  },
                ],
              },
            ],
          };
          partNumberModule.createEmpty(newEntry);
          partSlave.Addpart(newEntrySlave);
        }
      })
      .catch((err) => {
        console.error("Error:", err.message);
        res.status(500).send({ status: "Internal Server Error" });
      });
  },

  // New function to fetch all part numbers
  getAllPartNumbers: (req, res) => {
    partNumberModule.partNumberCollection
      .find({}) // Fetching all records
      .then((data) => {
        if (data && data.length > 0) {
          // Sending the fetched part numbers
          return res.status(200).send({
            status: "Fetched all part numbers successfully",
            data: data,
          });
        } else {
          // No part numbers found
          return res.status(404).send({
            status: "No part numbers found",
          });
        }
      })
      .catch((err) => {
        console.error("Error:", err.message);
        res.status(500).send({
          status: "Internal Server Error",
          message: err.message,
        });
      });
  },
};
