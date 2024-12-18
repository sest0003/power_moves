var express = require('express');
var router = express.Router();
const loginService = require('../service/LoginService');
const { getDropdownData } = require('../middleware/middleware');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', getDropdownData, async function(req, res, next) {  
  try {

      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(401).render('login', {
          message: 'Email or password i missing. Please try again.',
          messageType: 'error'
        });      
      }

      const user = await loginService.login(email, password);
      const token = user.data.token;
      console.log("token " + token);
      

      if (!user || !token) {
        return res.status(401).render('login', {
          message: 'unauthorized user. Please try again.',
          messageType: 'error',
        });      
      }

      // I Store the token in the response in a cookie
      // the cookie get ent with other endpoints. 
      res.cookie('jwt', token, {
        httpOnly: true, // makes it unavaible in javascript
        secure: false,
        maxAge: 3600000  
      });

      return res.status(200).render('products', {
        user,
        products: res.locals.products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
        });

      } catch (error) {
        console.error(error.message);
        return res.status(500).render('login', {
          message: 'Email or password i missing. Please try again.',
          messageType: 'error'
        });  
      }
 });

 router.get('/logout', async function(req, res, next) {
  res.clearCookie('jwt');
  res.redirect('/');
});


module.exports = router;
