var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');
const { getDropdownData, isAuthAdmin } = require('../middleware/middleware');



// getDropdownData is a middleware to get all default products 
// for the dropdownmenues and table to avoid repetions in the routes
router.get('/', isAuthAdmin, getDropdownData, async function(req, res, next) {
  // Set userdata token and role in the reg.user
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

 router.post('/search', isAuthAdmin, getDropdownData, async function(req, res, next) {
 
  try {
 
    const { searchType, catId, brandId, searchValue } = req.body;

    let products;

    if(searchType === 'category') {
      products = await productService.fetchProductsByCategory(catId, req.user);
    } else if(searchType === 'brand') {
      products = await productService.fetchProductsByBrand(brandId, req.user);
    } else if(searchType === 'search') {
      console.log('search');
      products = await productService.fetchProductsByPartialName(searchValue, req.user);
    }
  
      // Flatten the array to fit  <%= product.Brand %> in the ejs
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

 router.post('/add', isAuthAdmin, getDropdownData, async function(req, res, next) {
  
  const { name, desc, price, stock, imageUrl, brandId, categoryId } = req.body;
  
  try {

      const product = await productService.addProduct(req.body, req.user);

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

 router.post('/edit', isAuthAdmin, getDropdownData, async function(req, res, next) {
  
  const { id, name, desc, price, stock, imageUrl, isDeleted, brandId, categoryId } = req.body;

  try {

    const product = await productService.editProduct(req.body, req.user);

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
