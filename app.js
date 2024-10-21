const express = require('express');
const headercontroller = require('./controller/headercontroller');
const commodityController = require('./controller/commodityController');
const subCommodityController = require('./controller/subcommodityController')

const db = require('./database');
const partNumberController = require('./controller/partNumberController');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.set("view engine", "ejs");

app.get('/partNumber',function(req, res){
    res.render("index")
})

app.post('/createHeader',headercontroller.addHeader)
app.post('/createCommodity',commodityController.addcommodity)
app.post('/createSubCommodity',subCommodityController.addSubCommodity)
app.post('/createpartNumber',partNumberController.addPartNumber)

app.get('/', function (req, res) {
    res.render("partNumber")
});

app.get('/editTables', (req, res) => {
    res.render("editTables")
})

app.get('/getheader', headercontroller.getHeaderDetails);
app.get('/getcommodity', commodityController.getCommodityDetails);
app.post('/getsubcommodity', subCommodityController.getSubCommodity);

app.listen(3000,()=>console.log("Port is started"))
