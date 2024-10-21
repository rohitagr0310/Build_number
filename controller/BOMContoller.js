const BOMModule = require("../module/BOMModule");

module.exports = {
    EnterField: (fields) => {
        return new Promise((resolve, reject) => {
            let { header, Commodity, SubCommodity, Part_No, revised_No } = fields;
            console.log(Part_No);
            let revised_No_string = '';

            if (parseInt(SubCommodity) < 10) SubCommodity = '0' + SubCommodity;

            if (parseInt(Part_No) < 10) Part_No = '00' + Part_No;
            else if (parseInt(Part_No) < 100) Part_No = '0' + Part_No;

            if (revised_No < 10) revised_No_string = '0' + revised_No.toString();
            else revised_No_string = revised_No.toString();

            const serial_No = header + Commodity + SubCommodity + Part_No + '-' + revised_No_string;

            const field = {
                serial_No: serial_No
            };

            BOMModule.BOMCollection.findOne(field)
                .then((data) => {
                    if (data) {
                        console.log("Data is already present");
                        resolve(field);
                    } else {
                        BOMModule.Entry(field)
                            .then(() => {
                                console.log("New entry added:", serial_No);
                                resolve(field);
                            })
                            .catch((err) => {
                                console.error("Error adding new entry:", err);
                                reject(err);
                            });
                    }
                })
                .catch((err) => {
                    console.error("Error finding serial number:", err);
                    reject(err);
                });
        });
    }
};
