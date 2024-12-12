var express = require('express');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var CategoryService = require("../service/CategoryService")
var categoryService = new CategoryService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.get('/all', async (req, res) => {
    
    try {
        let categories = await categoryService.getAll();
        if (!categories) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No categories was found",
            });
        }

        res.jsend.success({data: categories});

    } catch (err) {
        console.error(err);
        res.jsend.error({
            "statuscode": 500,
            "result": "Error finding categories.", err
        });
    }
});

router.post('/add', jsonParser, async (req, res) => {

    const { name } = req.body;

    if (!req.body) {
        return res.jsend.fail({ "result": "data is missing from json body." });
    }
    try {
        const category = await categoryService.create(name);
        if (!category) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No category was found",
            });
        }

        res.jsend.success(category);

    } catch (err) {
        console.error(err);
        res.jsend.error({
            "statuscode": 500,
            "result": "Error creating category.", err
        });
    }
});

router.put('/:categoryId', async (req, res) => {

    const { categoryId } = req.params;
    const name = req.body;

    if (!categoryId) {
        return res.jsend.fail({ 
            "statuscode": 404,
            "result": "Category ID is missing."
         });
    }
    
    try {
        let category = await categoryService.updateName(categoryId, name);
        if (!category) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No category was found",
            });
        }
        res.jsend.success(category);
        } catch (err) {
            res.jsend.error({
                "statuscode": 500,
                "result": "Error updating category.", err
            });
        }
});

router.delete('/:categoryId', async (req, res) => {
  
    const { categoryId } = req.params;

    if (!categoryId) {
        return res.jsend.fail({ 
            "statuscode": 404,
            "result": "Category ID is missing."
         });
    }

    try {
        const  category = await  categoryService.deleteCategory(categoryId);
        if (!category) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No category was found",
            });
        }
        res.jsend.success({ 
            "statuscode": 200,
            "result": "Category deleted successfully."
         });
    } catch (err) {
        res.jsend.error({
            "statuscode": 500,
            "result": "Error deleting category.", err
        });
    }
});


module.exports = router;