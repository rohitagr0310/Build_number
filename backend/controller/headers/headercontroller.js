const headerModule = require("../../module/headers/headerModule");

module.exports = {
  addHeader: (req, res) => {
    const headerContent = req.body;
    headerModule.headerCollection
      .findOne({ code: headerContent.code })
      .then((prev) => {
        if (prev) {
          // headerContent.revisionNumber = prev.revisionNumber + 1;
          // console.log(headerContent)
          // console.log(prev);
          // return headerModule.addHeader(headerContent)
          // .then((data)=>{
          //     res.redirect('/')
          // })
          res.send({ status: "Already Present" });
        } else {
          // headerContent.revisionNumber = 1;
          return headerModule.addHeader(headerContent).then((data) => {
            res.send({ status: "Header Added Successfully" });
          });
        }
      });
  },
  getHeaderDetails: (req, res) => {
    headerModule.headerCollection
      .find({})
      .then((headers) => {
        if (headers && headers.length > 0) {
          res.send(headers);
        } else {
          res.status(404).send({ error: "No Header found" });
        }
      })
      .catch((error) => {
        console.error("Error fetching header details:", error);
        res.status(500).send({ error: "Internal Server Error" });
      });
  },
};
