var express = require('express');
var router = express.Router();
const orderService = require('../service/OrderService');


router.get('/', async function(req, res, next) {
  try {
          // Here i fetch message from other redirects, if existing and send it back to the ejs
          const orders = await orderService.fetchOrders();

          res.render('orders', { orders });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding orders. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
     });

router.post('/edit', async function(req, res, next) {

  const {id, statusId} = req.body;

  try {
  const order = await orderService.editOrder(req.body);

  if(!order) {
    res.status(404);
        req.flash('message', 'Failed to find brand. Please try again');
        req.flash('messageType', 'error');
        return res.redirect('/orders');  
      }

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
