var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');
const { filterBrands, filterCategories } = require('../service/dropdownService');
/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/home', async function(req, res, next) {
  try {
      const productData = await productService.fetchProducts();
      
      // Filter Brand and categories for dropdown menues
      const uniqueBrands = filterBrands(productData);
      const uniqueCategories = filterCategories(productData);

      res.render('home', { products: productData, uniqueBrands: uniqueBrands, uniqueCategories: uniqueCategories });

      } catch (error) {
          console.error('error while fetching products')
          res.status(500).send('error loading products')
      }
 });

 router.post('/products/search', async function(req, res, next) {
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
      
      // Filter Brand and categories for dropdown menues
      const productData = await productService.fetchProducts();
      const uniqueBrands = filterBrands(productData);
      const uniqueCategories = filterCategories(productData);

      res.render('home', { products, uniqueBrands, uniqueCategories });

      } catch (error) {
          console.error('error while fetching products')
          res.status(500).send('error loading products')
      }
 });


module.exports = router;
