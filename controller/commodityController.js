const commodityModule = require('../module/commodityModule');
const subCommodityModule = require('../module/subCommodityModule');

module.exports= {
    addcommodity :(req, res) => {
        const commodityContent = req.body
        commodityModule.commodityCollection.findOne({ code: commodityContent.code }).sort({ _id: -1 }).limit(1)
        .then((prev) => {
            if(prev){
                // commodityContent.revisionNumber = prev.revisionNumber + 1;
                // return commodityModule.addCommodity(commodityContent)
                // .then((data)=>{
                //     res.redirect('/')
                // })
                res.send({status:"Already Present Commodity"})
            }
            else{
                // commodityContent.revisionNumber = 1;
                return commodityModule.addCommodity(commodityContent)
                .then((data)=>{
                    const field = {
                        subcommodity : commodityContent.code,
                        CrossEntry : []
                    }
                    subCommodityModule.createEmpty(field)
                    .then(()=>{
                        console.log("subCommodity Created Succesfully")
                        res.send({status:"subCommodity Created Succesfully"})
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        })

        
    },
    getCommodityDetails: (req, res) => {
        commodityModule.commodityCollection.find()
            .then((commodities) => {
                if (commodities && commodities.length > 0) {
                    res.send(commodities);
                } else {
                    res.status(404).send({ error: "No commodities found" });
                }
            })
            .catch((error) => {
                console.error("Error fetching commodity details:", error);
                res.status(500).send({ error: "Internal Server Error" });
            });
    }
}