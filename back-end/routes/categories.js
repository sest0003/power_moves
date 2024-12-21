var express = require('express');
var jsend = require('jsend');
const { isAuth, isAdmin} = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var CategoryService = require("../service/CategoryService")
var categoryService = new CategoryService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.get('/all', isAuth, isAdmin, async (req, res) => {
    
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
        res.jsend.error({
            "statuscode": 500,
            "message": "Error finding categories",
            data: { error: err.message}
        });
    }
});

router.post('/add', isAuth, isAdmin, jsonParser, async (req, res) => {

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
        res.jsend.error({
            "statuscode": 500,
            "message": "Error creating category",
            data: { error: err.message}
        });
    }
});

router.put('/edit/:categoryId', isAuth, isAdmin, async (req, res) => {

    const { categoryId } = req.params;
    const { name } = req.body;

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
            "message": "Error update category",
            data: { error: err.message}
        });
    }
});

router.delete('/delete/:categoryId', isAuth, isAdmin, async (req, res) => {
  
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
                "message": "Error deleting category",
                data: { error: err.message}
            });
        }
});


module.exports = router;