var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');
const { filterBrands, filterCategories } = require('../service/dropdownService');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');


// Middleware function get dropdown data
async function getDropdownData(req, res, next) {
    try {
        const productData = await productService.fetchProducts(req);
        res.locals.products = productData;
        res.locals.uniqueBrands = filterBrands(productData);
        res.locals.uniqueCategories = filterCategories(productData);
        next();

    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).send('error loading products')
    }
}

/* Middleware to validate user admin in the frontend app 
and send the token to the backend app via req.user  */
async function isAuthAdmin(req, res, next) {
    if(req.session.token && req.session.role === 1) {
        req.user = { token: `Bearer ${req.session.token}`, role: req.session.role }
        next();
    } else {
        res.status(401).redirect('/');
    }
}



module.exports = { getDropdownData, isAuthAdmin };

