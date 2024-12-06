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


router.post('/cart/checkout/now/:cartId', jsonParser, /* isAuth, */ async (req, res) => {
    
    const { cartId } = req.params;
    
    try { 
       /*  const user = req.user; */
        // Find user
       let user = await userService.getOneById(1);

        // Create Order
        const order = await orderService.createOrder(cartId, user);

        res.jsend.success({ message: "Order created.", order});
    } catch (err) {
        console.error(err);
        res.jsend.error("Error while creating order.");
    }
});

router.get('/orders', jsonParser, /* isAuth, */ async (req, res) => {

    const { cartId } = req.params;
    try { 
       /*  const user = req.user; */
        // Find user
       let user = await userService.getOneById(1);
       let orders = await orderService.getAll(user.id);
       res.jsend.success(orders);
   } catch (err) {
       console.error(err);
       res.jsend.error("found no orders.");
   }
   });


module.exports = router;