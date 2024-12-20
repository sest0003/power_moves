var express = require('express');
var router = express.Router();
const categoryService = require('../service/CategoryService');
const { getDropdownData } = require('../middleware/middleware');



router.get('/', async function(req, res, next) {
  try {

        const categories = await categoryService.fetchCategories();
        res.render('categories', { categories });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding categories. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
     });

 router.post('/add', async function(req, res, next) {
  
  const { name } = req.body;

  try {
    
      const category = await categoryService.addCategory(req.body);

      req.flash('message', 'Brand was successfully created!');
      req.flash('messageType', 'success');
      res.redirect('/categories');  

      } catch (error) {
       console.error('Error creating brand', error.message);
       req.flash('message', 'Error creating brand. Please try again');
       req.flash('messageType', 'error');  
       res.redirect('/categories');  
      }
 });

 router.post('/edit', async function(req, res, next) {
  
  const {id, name} = req.body;
  
  try {
    
    const brand = await categoryService.editCategory(req.body);

      req.flash('message', 'Category was successfully changed!');
      req.flash('messageType', 'success');
      res.redirect('/categories');  

    } catch (error) {
      console.error('Error editing brand', error.message);
      req.flash('message', 'Error editing brand. Please try again');
      req.flash('messageType', 'error');  
      res.redirect('/categories');  
     }
 });

 router.post('/delete', async function(req, res, next) {
  
  const {categoryId} = req.body;
  
  try {
    
    const result = await categoryService.deleteCategory(categoryId);

    if(!result) {
      res.status(401);
      req.flash('message', 'No category was found. Please try again');
      req.flash('messageType', 'error');
        return res.redirect('/categories');  
    }

      req.flash('message', 'Category was successfully deleted!');
      req.flash('messageType', 'success');
      res.redirect('/categories');  

      } catch (error) {
        console.error('Error deleting brand', error.message);
        req.flash('message', 'Error deleting category. Please try again');
        req.flash('messageType', 'error');  
        res.redirect('/categories');  
      }
 });



module.exports = router;
