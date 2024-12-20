var express = require('express');
var router = express.Router();
const loginService = require('../service/LoginService');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', async function(req, res, next) {  

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).render('login', {
      message: 'Email or password i missing. Please try again.',
      messageType: 'error'
    });      
  }

  try {
      const user = await loginService.login(email, password);
      const token = user.data.token; 
      const role = user.data.role;
     
      if(token && role) { 
        req.session.token = token;
        req.session.role = role;

      return res.redirect('/products'); 
      
      } else {
        req.flash('message', 'Login failed. user information is missing on the server, please try again');
        req.flash('messageType', 'error');  
        res.redirect('/');  
      }
      
      } catch (error) {
        console.error(error.message);
        req.flash('message', 'Error trying to login in. something is wrong');
        req.flash('messageType', 'error');  
        res.redirect('/');  
      }
 });

 router.get('/logout', async function(req, res, next) {
  res.clearCookie('jwt');
  res.redirect('/');
});


module.exports = router;
