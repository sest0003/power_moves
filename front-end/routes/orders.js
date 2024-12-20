var express = require('express');
var router = express.Router();
const orderService = require('../service/OrderService');
const { isAuthAdmin } = require('../middleware/middleware');


router.get('/', isAuthAdmin, async function(req, res, next) {
  
  try {
          const orders = await orderService.fetchOrders(req);

          res.render('orders', { orders });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding orders. Please try again');
            req.flash('messageType', 'error');
            return res.redirect('/products');  
          }
     });

router.post('/edit', isAuthAdmin, async function(req, res, next) {

  const {id, statusId} = req.body;

  try {
  const order = await orderService.editOrder(req);

    req.flash('message', 'The order was successfully changed.');
    req.flash('messageType', 'success');
    res.redirect('/orders');  

  } catch (error) {
    console.error('Error creating brand', error.message);
    req.flash('message', 'Error creating brand. Please try again');
    req.flash('messageType', 'error');  
    res.redirect('/orders');  
   }
});





module.exports = router;
