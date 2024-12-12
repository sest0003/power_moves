var express = require('express');
var router = express.Router();
const productService = require('../service/ProductService');

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/home', async function(req, res, next) {
  try {
      const productData = await productService.fetchMemes();
      res.render('home', { products: productData });
      } catch (error) {
          console.error('error while fetching products')
          res.status(500).send('error loading products')
      }
 });


module.exports = router;
