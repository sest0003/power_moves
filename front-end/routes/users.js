var express = require('express');
var router = express.Router();
const userService = require('../service/UserService');

router.get('/', async function(req, res, next) {
  try {

      const users = await userService.fetchUsers();

      res.render('users', { users });

      } catch (error) {
        res.status(500);
        req.flash('message', 'Error finding users. Please try again');
        req.flash('messageType', 'error');
        return res.redirect('/products');  
      }
});

 router.post('/register', async function(req, res, next) {
  
  const { firstname, lastname, username, email, adress, phone, password } = req.body;
  
  try {
      const user = await userService.registerUser(req.body);

      req.flash('message', 'An account was successfully created!');
      req.flash('messageType', 'success');
      res.redirect('/users');  

      } catch (error) {
      console.error('Error creating user', error.message);
      req.flash('message', 'Error creating user. Please try again');
      req.flash('messageType', 'error');  
      res.redirect('/users');  
      }
});


 router.post('/delete', async function(req, res, next) {
  
  const {userId} = req.body;
  
  try {
    const result = await userService.deleteUser(userId);

      req.flash('message', 'user was successfully deleted!');
      req.flash('messageType', 'success');
      res.redirect('/users');  

      } catch (error) {
        console.error('Error deleting user', error.message);
        req.flash('message', 'Error deleting user. Please try again');
        req.flash('messageType', 'error');  
        res.redirect('/users');  
      }
});



module.exports = router;
