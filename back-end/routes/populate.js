var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('crypto');
var PopulateService = require("../service/PopulateService")
var populateService = new PopulateService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.post("/", async (req, res) => {
    try {
        const result = await populateService.populateDatabase();

        if (!result.success) {  
            return res.jsend.fail({ message: result.message });
        }

        res.jsend.success({ message: result.message });

    } catch (err) {
        console.error("❌ Route error:", err);
        res.jsend.error({ message: "Error populating the database.", error: err.message });
    }
});

router.post("/stars", async (req, res) => {
    try {
        const result = await populateService.calculatePlayerStars();

        if (!result.success) {  
            return res.jsend.fail({ message: result.message });
        }

        res.jsend.success({ message: result.message });

    } catch (err) {
        console.error("❌ Route error:", err);
        res.jsend.error({ message: "Error calculating stars.", error: err.message });
    }
});

router.post("/moves", async (req, res) => {
    try {
        const result = await populateService.calculateMoves();

        if (!result.success) {  
            return res.jsend.fail({ message: result.message });
        }

        res.jsend.success({ message: result.message });

    } catch (err) {
        console.error("❌ Route error:", err);
        res.jsend.error({ message: "Error calculating moves.", error: err.message });
    }
});

module.exports = router;