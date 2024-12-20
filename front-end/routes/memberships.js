var express = require('express');
var router = express.Router();
const membershipService = require('../service/MembershipService');
const { isAuthAdmin } = require('../middleware/middleware');



router.get('/', isAuthAdmin, async function(req, res, next) {
  try {
          const memberships = await membershipService.fetchMemberships(req);

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

 router.post('/add', isAuthAdmin, async function(req, res, next) {

  const { type, discount } = req.body;

  try {

    const membership = await membershipService.addMembership(req);

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

 router.post('/edit', isAuthAdmin, async function(req, res, next) {
  
  const {id, type, discount} = req.body;
  console.log(req.body);
  
  try {

    const membership = await membershipService.editMembership(req);
    console.log(membership);

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

 router.post('/delete', isAuthAdmin, async function(req, res, next) {
  
  const {membershipsId} = req.body;
  
  try {
    
      const result = await membershipService.deleteMembership(req);

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
