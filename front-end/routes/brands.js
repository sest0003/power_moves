var express = require('express');
var router = express.Router();
const brandService = require('../service/BrandService');



router.get('/', async function(req, res, next) {
  try {
          // Here i fetch message from other redirects, if existing and send it back to the ejs
          const brands = await brandService.fetchBrands();

          if(!brands) {
            req.flash('message', 'No brands found. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
    
          res.render('brands', { brands });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding brands. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
     });

 router.post('/add', async function(req, res, next) {
  try {
    const { name } = req.body;
    const brand = await brandService.addBrand(req.body);

      if(!brand) {
        res.status(404);
        req.flash('message', 'Failed to find brand. Please try again');
        req.flash('messageType', 'error');
          return res.redirect('/brands');  
      }

      req.flash('message', 'Brand was successfully created!');
      req.flash('messageType', 'success');
      res.redirect('/brands');  

      } catch (error) {
       console.error('Error creating brand', error.message);
       req.flash('message', 'Error creating brand. Please try again');
       req.flash('messageType', 'error');  
       res.redirect('/brands');  
      }
 });

 router.post('/edit', async function(req, res, next) {
  
  try {
    const {id, name} = req.body;
    const brand = await brandService.editBrand(req.body);

    if(!brand) {
      return res.status(401).render('brands', {
        message: 'fail to edit brand',
        messageType: 'error',
      });     
  }
      res.render('brands', {
        message: 'Brand was successfully changed',
        messageType: 'success'
        });

      } catch (error) {
        res.render('brands', {
          message: 'Error editing brand. ${error.message}. Please try again.',
          messageType: 'error',
        });
      }
 });

 router.post('/delete', async function(req, res, next) {
  
  try {
    const {brandId} = req.body;
    
    const result = await brandService.deleteBrand(brandId);

    if(!result) {
      res.status(401);
      req.flash('message', 'No brand was found. Please try again');
      req.flash('messageType', 'error');
        return res.redirect('/brands');  
    }

      req.flash('message', 'Brand was successfully deleted!');
      req.flash('messageType', 'success');
      res.redirect('/brands');  

      } catch (error) {
        console.error('Error deleting brand', error.message);
        req.flash('message', 'Error deleting brand. Please try again');
        req.flash('messageType', 'error');  
        res.redirect('/brands');  
      }
 });



module.exports = router;
