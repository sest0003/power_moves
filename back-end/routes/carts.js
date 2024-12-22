var express = require('express');
const { isAuth, isAdmin} = require('../middleware/middleware');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ProductService = require("../service/ProductService");
var UserService = require("../service/UserService");
var CartService = require("../service/CartService");
var OrderService = require("../service/OrderService");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');

router.use(jsend.middleware);

var productService = new ProductService(db);
var userService = new UserService(db);
var cartService = new CartService(db, userService, productService);
var orderService = new OrderService(db, userService, productService);


router.post('/add/:productId/:units', isAuth, jsonParser, async (req, res) => {

    // #swagger.tags = ['Cart']
    // #swagger.description = "Adds a product to a cart"
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]

    // logged in user
    const userId = req.user.id;

    const { productId, units} = req.params;

   
  
    try { 
       
        // Add product
        const cart = await cartService.addProductToCart(userId, productId, units); // req.body is the User object

        if (cart.message === "No product was found") {
            return res.jsend.fail({ 
                "statuscode": 404,
                "result": "No product was found",
            });
        }

        if(cart.message ===  "no enough in stock.") {
            return res.jsend.fail({
                "statuscode": 404,
                "result": "no enough in stock."});
        }  

        if(cart.message ===  "you must login to add products to your cart") {
            return res.jsend.fail({
                "statuscode": 404,
                "result": "you must login to add products to your cart"});
        }  

       

        res.jsend.success({ message: "product added to the cart", cart});
    
    } catch (err) {
        console.error(err);
        res.jsend.error("Error while adding product to cart.");
    }
});

router.post('/checkout/now/:cartId/:userId', isAuth, jsonParser, async (req, res) => {
    
    // #swagger.tags = ['Cart']
    // #swagger.description = "checkout cart and creates a order."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]
    
    const { cartId, userId } = req.params;
    const user = req.user
    
    try { 
        // Create Order
        const order = await orderService.createOrder(cartId, userId);

        res.jsend.success({ message: "Order created.", order});
    } catch (err) {
        console.error(err);
        res.jsend.error("Error while creating order.");
    }
});




 module.exports = router;