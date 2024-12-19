var express = require('express');
var router = express.Router();
const membershipService = require('../service/MembershipService');



router.get('/', async function(req, res, next) {
  try {
          // Here i fetch message from other redirects, if existing and send it back to the ejs
          const memberships = await membershipService.fetchMemberships();

          if(!memberships) {
            req.flash('message', 'failed to find memberships. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
    
          res.render('memberships', { memberships });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding memberships. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
});

 router.post('/add', async function(req, res, next) {
  try {
    const { type, discount } = req.body;
    const membership = await membershipService.addMembership(req.body);

      if(!membership) {
        res.status(404);
        req.flash('message', 'Failed to find membership. Please try again');
        req.flash('messageType', 'error');
          return res.redirect('/memberships');  
      }

      req.flash('message', 'membership was successfully created!');
      req.flash('messageType', 'success');
      res.redirect('/memberships');  

      } catch (error) {
       console.error('Error creating membership', error.message);
       req.flash('message', 'Error creating membership. Please try again');
       req.flash('messageType', 'error');  
       res.redirect('/memberships');  
      }
 });

 router.post('/edit', async function(req, res, next) {
  
  try {
    const {id, type, discount} = req.body;
    const membership = await membershipService.editMembership(req.body);

    if(!membership) {
      res.status(404);
      req.flash('message', 'Failed to edit membership. Please try again');
      req.flash('messageType', 'error');
      return res.redirect('/memberships');  
    }

      req.flash('message', 'membership was successfully edited!');
      req.flash('messageType', 'success');
      res.redirect('/memberships'); 

      } catch (error) {
        console.error('Error editing membership', error.message);
        req.flash('message', 'Error editing membership. Please try again');
        req.flash('messageType', 'error');  
        res.redirect('/memberships');  
       }
 });

 router.post('/delete', async function(req, res, next) {
  
  try {
    const {membershipsId} = req.body;
    
    const result = await membershipService.deleteMembership(membershipsId);

    if(!result) {
      res.status(401);
      req.flash('message', 'No membership was found. Please try again');
      req.flash('messageType', 'error');
        return res.redirect('/memberships');  
    }

      req.flash('message', 'membership was successfully deleted!');
      req.flash('messageType', 'success');
      res.redirect('/memberships');  

      } catch (error) {
        console.error('Error deleting membership', error.message);
        req.flash('message', 'Error deleting membership. Please try again');
        req.flash('messageType', 'error');  
        res.redirect('/memberships');  
      }
 });



module.exports = router;
