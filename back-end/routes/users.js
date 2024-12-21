var express = require('express');
var jsend = require('jsend');
const isAuth = require('../middleware/middleware');
var router = express.Router();
var db = require("../models");
var UserService = require("../service/UserService")
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

router.use(jsend.middleware);

/* GET users listing. */
router.get('/all', isAuth, async (req, res) => {
  try {
      let users = await userService.getAll();
      if (!users) {
          return res.jsend.fail({ 
              "statuscode": 404,
              "result": "No users was found",
          });
      }

      res.jsend.success({data: users});

      } catch (err) {
          console.error(err);
          res.jsend.error({
              "statuscode": 500,
              "result": "Error finding users.", err
          });
      }
});

router.put('/edit/:userId', isAuth, async (req, res) => {

    const { userId } = req.params;
    const updateData = req.body;
    
    try {
        let user = await userService.updateRole(userId, updateData);
        if (order === null) {
            return res.jsend.fail({"result": "no user were found during editing user."});
        }
        res.jsend.success(user);
        } catch (err) {
            console.error(err);
            res.jsend.error("Error updating user role.");
        }
});


module.exports = router;
