var express = require('express');
const isAuth = require('../middleware/middleware');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ProductService = require("../service/ProductService");
var CartService = require("../service/CartService");
var OrderService = require("../service/OrderService");
var UserService = require("../service/UserService");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');

router.use(jsend.middleware);

var productService = new ProductService(db);
var cartService = new CartService(db);
var userService = new UserService(db);
var orderService = new OrderService(db, userService);


router.get('/all', jsonParser, async (req, res) => {

     const { cartId } = req.params;

    try { 
       let orders = await orderService.getAll();
       
       if(!orders) {
        return res.jsend.fail({"result": "no order found."});
       } 
       
       res.jsend.success(orders);

   } catch (err) {
       console.error(err);
       res.jsend.error("Error finding orders.");
   }
});

router.put('/:orderId', async (req, res) => {

    const { orderId } = req.params;
    const updateData = req.body;
    
    try {
        let order = await orderService.updateOrder(orderId, updateData);
        if (order === null) {
            return res.jsend.fail({"result": "no order found."});
        }
        res.jsend.success(order);
        } catch (err) {
            console.error(err);
            res.jsend.error("Error updating order.");
        }
});

router.delete('/:orderId/', async (req, res) => {
  
    const { orderId } = req.params;

    if (!orderId) {
        return res.jsend.fail({ "result": "Order id is missing in the url." });
    }

    try {
        const order = await orderService.deleteOrder(orderId);
        if (!order) {
            return res.jsend.fail({ "result": "order not found or not authorized." });
        }
        res.jsend.success({ "result": "order deleted successfully." });
    } catch (err) {
        console.log(err);
        res.jsend.error("Error deleting order.");
    }
});

module.exports = router;