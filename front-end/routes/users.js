var express = require('express');
var router = express.Router();
const userService = require('../service/UserService');
const { isAuthAdmin } = require('../middleware/middleware');

router.get('/', isAuthAdmin, async function(req, res, next) {
  try {

      const users = await userService.fetchUsers(req);

      res.render('users', { users });

      } catch (error) {
        res.status(500);
        req.flash('message', 'Error finding users. Please try again');
        req.flash('messageType', 'error');
        return res.redirect('/products');  
      }
});

 router.post('/register', isAuthAdmin, async function(req, res, next) {
  
  const { firstname, lastname, username, email, adress, phone, password } = req.body;
  
  try {
      const user = await userService.registerUser(req.body, req.user);

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

router.post('/edit', isAuthAdmin, async function(req, res, next) {

  const {id, roleId} = req.body;

  try {
  const order = await userService.editRole(req);

    req.flash('message', 'The user role was successfully changed.');
    req.flash('messageType', 'success');
    res.redirect('/users');  

  } catch (error) {
    console.error('Error editing user role', error.message);
    req.flash('message', 'Error editing user role. Please try again');
    req.flash('messageType', 'error');  
    res.redirect('/users');  
   }
});

 router.post('/delete', isAuthAdmin, async function(req, res, next) {
  
  const {userId} = req.body;
  
  try {
    const result = await userService.deleteUser(req);

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
