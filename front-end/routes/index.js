var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');
const getDropdownData = require('../middleware/middleware');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// getDropdownData is a middleware to get all default products 
// for the dropdownmenues and table to avoid repetions in the routes
router.get('/home', getDropdownData, function(req, res, next) {
      res.render('home', { 
        products: res.locals.products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
      });
});  


 router.post('/products/search', getDropdownData, async function(req, res, next) {
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
    // I use flat to break down det nested Arrays
    products = products.flat();
    
      res.render('home', { products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
      });

      } catch (error) {
          console.error('error while fetching products')
          res.status(500).send('error loading products')
      }
 });

 router.post('/products/add', getDropdownData, async function(req, res, next) {
  
  try {
    const { name, desc, price, stock, imageUrl, brandId, categoryId } = req.body;

      const product = await productService.addProduct(req.body);

      res.render('home', {
        message: 'Product was successfully created',
        messageType: 'success',
        products: res.locals.products, 
        uniqueBrands: res.locals.uniqueBrands, 
        uniqueCategories: res.locals.uniqueCategories 
        });

      } catch (error) {
        res.render('home', {
          message: 'Error Adding Product. ${error.message}. Please try again.',
          messageType: 'error',
        });
      }
 });


module.exports = router;
