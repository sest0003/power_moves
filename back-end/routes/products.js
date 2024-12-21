var express = require('express');
var jsend = require('jsend');
const { isAuth, isAdmin} = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var ProductService = require("../service/ProductService")
var productService = new ProductService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


router.use(jsend.middleware);

router.get('/all', async (req, res) => {

    try {
        let products = await productService.getAll();

        if (products === null) {
            return res.jsend.fail({"result": "no product found."});
        }
        res.jsend.success({data: products});
        } catch (err) {
            console.error(err);
            res.jsend.error("Error finding products.");
        }
});

router.get('/:productId', async (req, res) => {

    const { productId }= req.params;

    try {
        let product = await productService.getOne(productId);
        console.log(product);
        if (product === null) {
            return res.jsend.fail({"result": "no product found."});
        }
        res.jsend.success({data: product});

        } catch (err) {
            console.error(err);
            res.jsend.error("Error finding product.");
        }
});

router.post('/search/category/:categoryId', async (req, res) => {

     const { categoryId } = req.params;

    try {
        let products = await productService.getByCategory(categoryId);
        if (!products) {
            return res.jsend.fail({"result": "no product found."});
        }
        res.jsend.success({data: products});
        } catch (err) {
            console.error(err);
            res.jsend.error("Error finding products.");
        }
});

router.post('/search/brand/:brandId', async (req, res) => {

    const { brandId } = req.params;

   try {
       let products = await productService.getByBrand(brandId);
       if (!products) {
           return res.jsend.fail({"result": "no product found."});
       }
       res.jsend.success({data: products});
       } catch (err) {
           console.error(err);
           res.jsend.error("Error finding products.");
       }
});

router.post('/search/:name', async (req, res) => {

    const { name } = req.params;

   try {
       let products = await productService.getByPartialName(name);
       if (!products) {
           return res.jsend.fail({"result": "no product found."});
       }
       res.jsend.success({data: products});
       } catch (err) {
           console.error(err);
           res.jsend.error("Error finding products.");
       }
});

router.post('/add', isAuth, isAdmin, jsonParser, async (req, res) => {

    const { name, description, imageUrl, unitPrice, stock, brandId, categoryId  } = req.body;

    if (!req.body) {
        return res.jsend.fail({ "result": "data is missing from json body." });
    }
    try {
        const product = await productService.create(name, description, imageUrl, unitPrice, stock, brandId, categoryId);
        
        res.jsend.success(product);

    } catch (err) {
        console.error(err);
        res.jsend.error("Error creating product.");
    }
});

router.put('/edit/:productId', isAuth, isAdmin, async (req, res) => {

    const { productId } = req.params;
    const updateData = req.body;

    try {
        let product = await productService.updateProduct(productId, updateData);
        if (!product) {
            return res.jsend.fail({"result": "no product found."});
        }
        res.jsend.success(product);
        
        } catch (err) {
            console.error(err);
            res.jsend.error("Error finding product.");
        }
});


 module.exports = router;