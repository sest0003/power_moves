var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');
const { getDropdownData } = require('../middleware/middleware');


// getDropdownData is a middleware to get all default products 
// for the dropdownmenues and table to avoid repetions in the routes
router.get('/', getDropdownData, function(req, res, next) {
  try {    
  res.render('products', { 
        products: res.locals.products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
      });
    } catch (error) {
      res.render('products', {
        message: 'Error finding Products. ${error.message}. Please try again.',
        messageType: 'error',
      });
    }
});  


 router.post('/search', getDropdownData, async function(req, res, next) {
  try {
    const { searchType, catId, brandId, searchValue } = req.body;

    let products;
    if(searchType === 'category') {
      console.log("cat");
      products = await productService.fetchProductsByCategory(catId);
    } else if(searchType === 'brand') {
      products = await productService.fetchProductsByBrand(brandId);
    } else if(searchType === 'search') {
      console.log('search');
      products = await productService.fetchProductsByPartialName(searchValue);
    }
  
    // Flatten the array to fit   <%= product.Brand %> in the ejs
    products = products.flat();
    
      res.render('products', { 
        products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
      });

    } catch (error) {
      res.render('products', {
        message: 'Error Adding Product. ${error.message}. Please try again.',
        messageType: 'error',
      });
    }
 });

 router.post('/add', getDropdownData, async function(req, res, next) {
  
  try {
    const { name, desc, price, stock, imageUrl, brandId, categoryId } = req.body;

      const product = await productService.addProduct(req.body);

      res.render('products', {
        message: 'Product was successfully created',
        messageType: 'success',
        products: res.locals.products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
        });

      } catch (error) {
        res.render('products', {
          message: 'Error Adding Product. ${error.message}. Please try again.',
          messageType: 'error',
        });
      }
 });

 router.post('/edit', getDropdownData, async function(req, res, next) {
  
  try {
    const { id, name, desc, price, stock, imageUrl, isDeleted, brandId, categoryId } = req.body;
    console.log("isDeleted " + isDeleted);
      const product = await productService.editProduct(req.body);

      res.render('products', {
        message: 'Product was successfully changed',
        messageType: 'success',
        products: res.locals.products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
        });

      } catch (error) {
        res.render('products', {
          message: 'Error editing product. ${error.message}. Please try again.',
          messageType: 'error',
        });
      }
 });


module.exports = router;
