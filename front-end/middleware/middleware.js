var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');
const { filterBrands, filterCategories } = require('../service/dropdownService');

// Middleware function get dropdown data
async function getDropdownData(req, res, next) {
    try {
        const productData = await productService.fetchProducts();
        res.locals.products = productData;
        res.locals.uniqueBrands = filterBrands(productData);
        res.locals.uniqueCategories = filterCategories(productData);
        next();

    } catch (error) {
        console.error('Error fetching products', error);
        res.status(500).send('error loading products')
    }
}

module.exports = getDropdownData;

