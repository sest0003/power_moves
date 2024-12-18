var express = require('express');
var router = express.Router();
const categoryService = require('../service/CategoryService');
const { getDropdownData } = require('../middleware/middleware');



router.get('/', async function(req, res, next) {
  try {
          // Here i fetch message from other redirects, if existing and send it back to the ejs
          const categories = await categoryService.fetchCategories();

          if(!categories) {
            req.flash('message', 'No categories found. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
    
          res.render('categories', { categories });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding categories. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
     });

 router.post('/add', async function(req, res, next) {
  try {
    const { name } = req.body;
    const category = await categoryService.addCategory(req.body);

      if(!brand) {
        res.status(401);
        req.flash('message', 'Failed creating category. Please try again');
        req.flash('messageType', 'error');
          return res.redirect('/categories');  
      }

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
  
  try {
    const {id, name} = req.body;
    const brand = await categoryService.editCategory(req.body);

    if(!category) {
      return res.status(401).render('categories', {
        message: 'fail to edit category',
        messageType: 'error',
      });     
  }
      res.render('categories', {
        message: 'Category was successfully changed',
        messageType: 'success'
        });

      } catch (error) {
        res.render('categories', {
          message: 'Error editing category. ${error.message}. Please try again.',
          messageType: 'error',
        });
      }
 });

 router.post('/delete', async function(req, res, next) {
  
  try {
    const {categoryId} = req.body;
    
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
