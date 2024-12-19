var express = require('express');
var router = express.Router();
const userService = require('../service/UserService');



router.get('/', async function(req, res, next) {
  try {
          // Here i fetch message from other redirects, if existing and send it back to the ejs
          const users = await userService.fetchUsers();

          if(!users) {
            req.flash('message', 'No users found. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
    
          res.render('users', { users });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding users. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
     });

 router.post('/register', async function(req, res, next) {
  try {
    const { firstname, lastname, username, email, adress, phone, password } = req.body;
    const user = await userService.registerUser(req.body);

      if(!user) {
        res.status(404);
        req.flash('message', 'Failed to register user. Please try again');
        req.flash('messageType', 'error');
          return res.redirect('/users');  
      }

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
  
  try {
    const {userId} = req.body;
    
    const result = await userService.deleteUser(userId);

    if(!result) {
      res.status(401);
      req.flash('message', 'No user was found. Please try again');
      req.flash('messageType', 'error');
        return res.redirect('/users');  
    }

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
