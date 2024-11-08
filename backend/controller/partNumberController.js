const partNumberModule = require("../module/partNumberModule");
const partSlave = require("../module/partSlave");
const BOMContoller = require("./BOMController");

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
            BOMContoller.EnterField(field).then((serial_No) => {
              // Old Data Is Being Modified
              data.CrossEntry[Part_No - 1].Definition =
                partNumberContent.Definition;
              data.CrossEntry[Part_No - 1].revisionNumber += 1; // Increment revision
              data.CrossEntry[Part_No - 1].revisedBy =
                partNumberContent.revisedBy;
              data.save();
              // Adding to Slave Collection
              const CrossEntry = {
                index: data.CrossEntry[Part_No - 1].index,
                Definition: partNumberContent.Definition,
                revisionNumber: data.CrossEntry[Part_No - 1].revisionNumber, // New revision number
                revisedBy: partNumberContent.revisedBy,
              };
              partSlave.partNumberCollection
                .findOne({
                  code_header: header,
                  code_Commodity: Commodity,
                  code_SubCommodity: SubCommodity,
                })
                .then((slave) => {
                  slave.CrossEntry.push(CrossEntry);
                  slave.save();
                  console.log("CrossEntry updated or added successfully");
                  return res.status(200).send({
                    status: "Updated a part and made a new entry",
                    serial_No: serial_No,
                  });
                });
            });
          } else if (Part_No > -1) {
            console.log("ram");
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

            BOMContoller.EnterField(field).then((serial_No) => {
              const CrossEntry = {
                index: data.CrossEntry.length + 1,
                Definition: partNumberContent.Definition,
                revisionNumber: 0, // Set revision number to 0 for the first entry
                revisedBy: partNumberContent.revisedBy,
              };

              data.CrossEntry.push(CrossEntry);
              data.save();

              // Adding to Part Slave
              partSlave.partNumberCollection
                .findOne({
                  code_header: header,
                  code_Commodity: Commodity,
                  code_SubCommodity: SubCommodity,
                })
                .then((slave) => {
                  if (slave) {
                    slave.CrossEntry.push(CrossEntry);
                    slave.save();
                    return res.send({
                      status: "Added a new part",
                      serial_No: serial_No,
                    });
                  }
                });
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
                revisionNumber: 0, // Start with revision number 0
                revisedBy: partNumberContent.revisedBy,
              },
            ],
          };
          partNumberModule.createEmpty(newEntry);
          partSlave.Addpart(newEntry);
          const field = {
            header: header,
            Commodity: Commodity,
            SubCommodity: partNumberContent.subCommodity,
            Part_No: 1,
            revised_No: 0, // Start with revision number 0
          };
          BOMContoller.EnterField(field).then((serial_No) => {
            res
              .status(200)
              .send({ status: "New Part Added", serial_No: serial_No });
          });
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
