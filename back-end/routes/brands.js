var express = require('express');
var jsend = require('jsend');
const { isAuth, isAdmin} = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var BrandService = require("../service/BrandService")
var brandService = new BrandService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.get('/', isAuth, isAdmin, async (req, res) => {

    // #swagger.tags = ['Brands']
    // #swagger.description = "Gets the list of all available brands."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]

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

router.post('/add', isAuth, isAdmin, jsonParser, async (req, res) => {

    // #swagger.tags = ['Brands']
    // #swagger.description = "Creates a new brand."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]
      /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
    required: true,
      "schema": {
        $ref: "#/definitions/Brand"
      }
    }
  */

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

router.put('/edit/:brandId', isAdmin, isAuth, async (req, res) => {

    // #swagger.tags = ['Brands']
    // #swagger.description = "Edits an existing brand."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]

    const { brandId } = req.params;
    const{ name } = req.body;

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

router.delete('/delete/:brandId', isAuth, isAdmin, async (req, res) => {

    // #swagger.tags = ['Brands']
    // #swagger.description = "Deletes a brand."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]
  
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