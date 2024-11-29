var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../service/UserService")
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
router.use(jsend.middleware);
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

// Post for new users to register / signup
router.post("/signup", async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = "Add a new user."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200]
  const { firstname, lastname, username, email, adress, phone, password } = req.body;
  var salt = crypto.randomBytes(16).toString('hex');
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    userService.create(firstname, lastname, username, email, adress, phone, hashedPassword, salt)
    res.jsend.success({"result": "You created an account."});
  });
});

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {
   // #swagger.tags = ['Users']
    // #swagger.description = "Login a user."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200]
       /* #swagger.parameters['body'] =  {
    "name": "body",
    "in": "body",
      "schema": {
        $ref: "#/definitions/User"
      }
    }
  */
  const { email, password } = req.body;
    userService.getOne(email).then((data) => {
        if (data === null) {
            return res.jsend.fail({"result": "no user with these credentials"});
        }
       
		if (!data.salt) {
            return res.status(500).json({ message: "Salt is undefined." });
        }

        crypto.pbkdf2(password, data.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if (err) { return next(err); }
            if (!crypto.timingSafeEqual(data.password, hashedPassword)) {
                return res.jsend.fail({"result": "Incorrect password"});
            }
            
            let token;
            try {
              token = jwt.sign(
                { id: data.id, email: data.email },
                process.env.TOKEN_SECRET,
                { expiresIn: "2h" }
              );
            } catch (err) {
              res.jsend.error("Something went wrong with creating JWT token")
            }
            res.jsend.success({"result": "You are logged in", "id": data.id, email: data.email, token: token}); 
        });
    });
});

router.get('/fail', (req, res) => {
	return res.status(401).jsend.error({ statusCode: 401, message: 'message', data: 'data' });
});

module.exports = router;

