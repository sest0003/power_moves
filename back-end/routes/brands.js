var express = require('express');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var BrandService = require("../service/BrandService")
var brandService = new BrandService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.get('/', isAuth, async (req, res) => {

    try {
        let brands = await brandService.getAll();
        if (!brands) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No brands was found",
            });
        }

        res.jsend.success({data: brands});

    } catch (err) {
        res.jsend.error({
            "statuscode": 500,
            "message": "Error finding brands",
            data: { error: err.message}
        });
    }
});

router.post('/add', jsonParser, async (req, res) => {

    const { name } = req.body;

    if (!req.body) {
        return res.jsend.fail({ "result": "data is missing from json body." });
    }
    try {
        const brand = await brandService.create(name);
        if (!brand) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No brand was found",
            });
        }

        res.jsend.success(brand);

    } catch (err) {
        res.jsend.error({
            "statuscode": 500,
            "message": "Error creating brand",
            data: { error: err.message}
        });
    }
});

router.put('/edit/:brandId', async (req, res) => {

    const { brandId } = req.params;
    const name = req.body;

    if (!brandId) {
        return res.jsend.fail({ 
            "statuscode": 404,
            "result": "Brand ID is missing."
         });
    }
    
    try {

        const brand = await brandService.updateName(brandId, name);
        if (!brand) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No brand was found",
            });
        }
        res.jsend.success(brand);
        } catch (err) {
            res.jsend.error({
                "statuscode": 500,
                "message": "Error updating brand",
                data: { error: err.message}
            });
        }
});

router.delete('/delete/:brandId', async (req, res) => {
  
    const { brandId } = req.params;

    if (!brandId) {
        return res.jsend.fail({ 
            "statuscode": 404,
            "result": "Brand ID is missing."
         });
    }

    try {
        const  brand = await  brandService.deleteBrand(brandId);
        if (!brand) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No brand was found",
            });
        }
        res.jsend.success({ 
            "statuscode": 200,
            "result": "Brand deleted successfully."
         });
    } catch (err) {
        res.jsend.error({
            "statuscode": 500,
            "result": "Error deleting brand.", err
        });
    }
});


module.exports = router;