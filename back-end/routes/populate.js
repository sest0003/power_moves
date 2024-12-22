var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var { check, validationResult } = require('express-validator')
var db = require("../models");
var crypto = require('crypto');
var PopulateService = require("../service/PopulateService")
var populateService = new PopulateService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.post('/', async (req, res) => {

    // #swagger.tags = ['Data']
    // #swagger.description = "Adding roles, memberships and a default admin user to database."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]

    try {
        const result = await populateService.populateDatabase();
        if (!result.success) {
            return res.jsend.fail({message: result.message});
        }
        res.jsend.success({message: result.message});
        } catch (err) {
            console.error(err);
            res.jsend.error("Error populating the database.");
        }
});




module.exports = router;