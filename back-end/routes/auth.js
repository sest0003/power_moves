var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var { check, validationResult } = require('express-validator')
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../service/UserService")
var userService = new UserService(db);
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

// Post for new users to register / signup
router.post("/register", jsonParser, 
  
    // #swagger.tags = ['Auth']
    // #swagger.description = "register user and creats a acoount i the database"
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 500]

  // Validation of creditials using express-validator
  [  
  check('email')
    .isEmail()
    .withMessage('not a valid email.'),
  check('password').isLength({ min: 6 })
    .withMessage('Password needs to be at least 6 digits long.')
  ],

  async (req, res, next) => {
    
  // Check for email/password errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.jsend.fail({ errors: errors.array() });
  }
  let { firstname, lastname, username, email, adress, phone, password } = req.body;
  const userData = { firstname, lastname, username, email, adress, phone, password };
  
  var salt = crypto.randomBytes(16).toString('hex');
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    
    // Updates userData
    userData.password = hashedPassword;
    userData.salt = salt;
    
    // Create User
    userService.create(userData)
    res.jsend.success({"result": "You created an account."});
  });
});

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {

    // #swagger.tags = ['Auth']
    // #swagger.description = "login user"
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 500]

  const { email, password } = req.body;
  
  userService.getOneByEmail(email).then((data) => {

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
                { id: data.id, email: data.email, roleId: data.roleId },
                process.env.TOKEN_SECRET,
                { expiresIn: "2h" }
              );
            } catch (err) {
              res.jsend.error("Something went wrong with creating JWT token")
            }
            res.jsend.success({"result": "You are logged in", "id": data.id, email: data.email, role: data.roleId, token: token}); 
        });
    });
});


module.exports = router;

