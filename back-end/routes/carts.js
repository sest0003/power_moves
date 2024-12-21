var express = require('express');
const { isAuth, isAdmin} = require('../middleware/middleware');
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


router.post('/add/:productId/:units', isAuth, jsonParser, async (req, res) => {

    const { productId, units } = req.params;
  
    try { 
        // Find product in database
        const product = await productService.getOne(productId);


        if (product === null) {
            return res.jsend.fail({"result": "no product found."});
        }

        if(product.stock < units) {
            return res.jsend.fail({"result": "no enough in stock."});
        }   
        
        // Add product
        const cart = await cartService.addProductToCart(user, product, units); // req.body is the User object

        // Update stock i product
        productService.updateStock(productId, units);

        res.jsend.success({ message: "product added to the cart", cart});
    } catch (err) {
        console.error(err);
        res.jsend.error("Error while adding product to cart.");
    }
});

router.post('/checkout/now/:cartId', isAuth, jsonParser, async (req, res) => {
    
    const { cartId } = req.params;
    
    try { 
        // Create Order
        const order = await orderService.createOrder(cartId, user);

        res.jsend.success({ message: "Order created.", order});
    } catch (err) {
        console.error(err);
        res.jsend.error("Error while creating order.");
    }
});




 module.exports = router;