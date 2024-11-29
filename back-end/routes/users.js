var express = require('express');
const isAuth = require('../../../deploy-assignment/middleware/middleware');
var router = express.Router();

/* GET users listing. */
router.get('/', isAuth, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
