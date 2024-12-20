var express = require('express');
var router = express.Router();
const brandService = require('../service/BrandService');
const { isAuthAdmin } = require('../middleware/middleware');



router.get('/', isAuthAdmin, async function(req, res, next) {

  try {
          const brands = await brandService.fetchBrands(req);

          res.render('brands', { brands });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding brands. Please try again');
            req.flash('messageType', 'error');
            return res.redirect('/products');  
          }
});

 router.post('/add', isAuthAdmin, async function(req, res, next) {
  
  const { name } = req.body;

  try {

      const brand = await brandService.addBrand(req);

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

 router.post('/edit', isAuthAdmin, async function(req, res, next) {
  
  const {id, name} = req.body;
  
  try {
    
    const brand = await brandService.editBrand(req);

    req.flash('message', 'Brand was successfully changed!');
    req.flash('messageType', 'success');
    res.redirect('/brands');  

      } catch (error) {
        res.render('brands', {
          message: 'Error editing brand. ${error.message}. Please try again.',
          messageType: 'error',
        });
      }
 });

 router.post('/delete', isAuthAdmin, async function(req, res, next) {
  
  const {brandId} = req.body;
  
  try {
    
    const result = await brandService.deleteBrand(req);

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
