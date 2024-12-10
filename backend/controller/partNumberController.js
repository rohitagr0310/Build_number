const partNumberModule = require("../module/partNumberModule");
const partSlave = require("../module/partSlave");
module.exports = {
  addPartNumber: async (req, res) => {
    try {
      const partNumberContent = req.body;
      const SubCommodity = parseInt(partNumberContent.subCommodity);
      const header = partNumberContent.header;
      const Commodity = partNumberContent.Commodity;
      const Part_No = parseInt(partNumberContent.Part_No);

      const data = await partNumberModule.partNumberCollection.findOne({
        code_header: header,
        code_Commodity: Commodity,
        code_SubCommodity: SubCommodity,
      });

      if (data) {
        if (data.CrossEntry.length >= Part_No && Part_No) {
          // Updating existing part
          const field = {
            header,
            Commodity,
            SubCommodity: partNumberContent.subCommodity,
            Part_No,
            revised_No: data.CrossEntry[Part_No - 1].revisionNumber + 1,
          };

          data.CrossEntry[Part_No - 1].Definition =
            partNumberContent.Definition;
          data.CrossEntry[Part_No - 1].revisionNumber += 1;
          data.CrossEntry[Part_No - 1].revisedBy = partNumberContent.revisedBy;

          await data.save();

          // Adding to Slave Collection
          const revision = {
            Definition: partNumberContent.Definition,
            revisionNumber: data.CrossEntry[Part_No - 1].revisionNumber,
            revisedBy: partNumberContent.revisedBy,
          };

          const result = await partSlave.partNumberCollection.updateOne(
            {
              code_header: header,
              code_Commodity: Commodity,
              code_SubCommodity: SubCommodity,
              "CrossEntry.index": data.CrossEntry[Part_No - 1].index,
            },
            {
              $push: { "CrossEntry.$.revisions": revision },
            }
          );

          if (result.modifiedCount > 0) {
            return res.status(200).send({
              status: "Updated a part and made a new entry",
            });
          } else {
            return res.status(404).send({ status: "CrossEntry not found" });
          }
        } else if (Part_No > -1) {
          return res.status(400).send({ status: "Part no. doesn't exist" });
        } else {
          // Adding new CrossEntry
          const newCrossEntry = {
            index: data.CrossEntry.length + 1,
            Definition: partNumberContent.Definition,
            revisionNumber: 1,
            revisedBy: partNumberContent.revisedBy,
          };

          data.CrossEntry.push(newCrossEntry);
          await data.save();

          // Adding to Slave Collection
          const slave = await partSlave.partNumberCollection.findOne({
            code_header: header,
            code_Commodity: Commodity,
            code_SubCommodity: SubCommodity,
          });

          if (slave) {
            slave.CrossEntry.push({
              index: data.CrossEntry.length,
              revisions: [
                {
                  Definition: partNumberContent.Definition,
                  revisionNumber: 1,
                  revisedBy: partNumberContent.revisedBy,
                },
              ],
            });

            await slave.save();

            return res.status(200).send({
              status: "Added a new part",
            });
          } else {
            return res.status(404).send({ status: "Slave entry not found" });
          }
        }
      } else {
        // Creating new entry
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

        await partNumberModule.createEmpty(newEntry);
        await partSlave.Addpart(newEntrySlave);

        return res.status(200).send({
          status: "Created new entry and slave entry",
        });
      }
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).send({ status: "Internal Server Error" });
    }
  },

  // New function to fetch all part numbers
  getAllPartNumbers: async (req, res) => {
    try {
      const data = await partNumberModule.partNumberCollection.find({});
      if (data && data.length > 0) {
        return res.status(200).send({
          status: "Fetched all part numbers successfully",
          data,
        });
      } else {
        return res.status(404).send({
          status: "No part numbers found",
        });
      }
    } catch (err) {
      console.error("Error:", err.message);
      return res.status(500).send({
        status: "Internal Server Error",
        message: err.message,
      });
    }
  },
};
