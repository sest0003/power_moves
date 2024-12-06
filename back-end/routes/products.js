var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ProductService = require("../service/ProductService")
var productService = new ProductService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.post('/add', jsonParser, async (req, res) => {

     const { name, description, imageUrl, unitPrice, stock  } = req.body;
 
     if (!name || !description || !imageUrl || !unitPrice || !stock) {
         return res.jsend.fail({ "result": "data is missing from json body." });
     }
     try {
         const product = await productService.create(name, description, imageUrl, unitPrice, stock);
         res.jsend.success(product);
     } catch (err) {
         console.error(err);
         res.jsend.error("Error creating product.");
     }
 });

 module.exports = router;