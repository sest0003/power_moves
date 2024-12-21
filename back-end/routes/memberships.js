var express = require('express');
var jsend = require('jsend');
const { isAuth, isAdmin} = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var MembershipService = require("../service/MembershipService")
var membershipService = new MembershipService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.use(jsend.middleware);

router.get('/', isAuth, isAdmin, async (req, res) => {

    try {
        let memberships = await membershipService.getAll();
        if (!memberships) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No memberships was found",
            });
        }

        res.jsend.success({data: memberships});

        } catch (err) {
            console.error(err);
            res.jsend.error({
                "statuscode": 500,
                "result": "Error finding memberships.", err
            });
        }
});

router.post('/add', isAuth, isAdmin, jsonParser, async (req, res) => {

    const { type, discount } = req.body;

    console.log(req.body);

    if (!req.body) {
        return res.jsend.fail({ "result": "data is missing from json body." });
    }
    try {
        const membership = await membershipService.create(type, discount);

        if (!membership) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No membership was found",
            });
        }

        res.jsend.success(membership);

    } catch (err) {
        console.error(err);
        res.jsend.error({
            "statuscode": 500,
            "result": "Error creating membership.", err
        });
    }
});

router.put('/edit/:membershipId', isAuth, isAdmin, async (req, res) => {

    const { membershipId } = req.params;
    const { type, discount } = req.body;
    console.log(req.body);

    if (!membershipId) {
        return res.jsend.fail({ 
            "statuscode": 404,
            "result": "membership ID is missing."
         });
    }
    
    try {
        let membership = await membershipService.update(membershipId, req.body);
        if (!membership) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "failed to edit membership",
            });
        }

        res.jsend.success(membership);
        
    } catch (err) {
            res.jsend.error({
                "message": "Error updating membership",
                "statuscode": 500,
                "result": "Error updating membership.", err
            });
        }
});

router.delete('/delete/:membershipId', isAuth, isAdmin, async (req, res) => {
  
    const { membershipId } = req.params;

    if (!membershipId) {
        return res.jsend.fail({ 
            "statuscode": 404,
            "result": "membership ID is missing."
         });
    }

    try {
        const membership = await brandService.deleteMembership(membershipId);
        if (!membership) {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "failed to delete membership",
            });
        }
        res.jsend.success({ 
            "statuscode": 200,
            "result": "Membership deleted successfully."
         });
    } catch (err) {
        res.jsend.error({
            "statuscode": 500,
            "result": "Error deleting membership.", err
        });
    }
});


module.exports = router;