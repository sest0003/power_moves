var express = require('express');
var router = express.Router();
const categoryService = require('../service/CategoryService');
const { isAuthAdmin } = require('../middleware/middleware');



router.get('/', isAuthAdmin, async function(req, res, next) {
  
    // #swagger.tags = ['Categories']
    // #swagger.description = "Gets the list of all available Categories."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]
  
  try {
        const categories = await categoryService.fetchCategories(req);
        res.render('categories', { categories });
    
          } catch (error) {
            res.status(500);
            req.flash('message', 'Error finding categories. Please try again');
            req.flash('messageType', 'error');
              return res.redirect('/products');  
          }
     });

 router.post('/add', isAuthAdmin, async function(req, res, next) {
  
    // #swagger.tags = ['Categories']
    // #swagger.description = "Creates a new category."
    // #swagger.produces = ['JSON']
    // #swagger.responses = [200, 404, 500]

  const { name } = req.body;

  try {
    
      const category = await categoryService.addCategory(req);

      req.flash('message', 'Categories was successfully created!');
      req.flash('messageType', 'success');
      res.redirect('/categories');  

      } catch (error) {
       console.error('Error creating category', error.message);
       req.flash('message', 'Error creating bracategorynd. Please try again');
       req.flash('messageType', 'error');  
       res.redirect('/categories');  
      }
 });

 router.post('/edit', isAuthAdmin, async function(req, res, next) {
  
  // #swagger.tags = ['Categories']
  // #swagger.description = "Edits an existing category."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200, 404, 500]
  const {id, name} = req.body;
  
  try {
    
    const category = await categoryService.editCategory(req);

      req.flash('message', 'Category was successfully changed!');
      req.flash('messageType', 'success');
      res.redirect('/categories');  

    } catch (error) {
      console.error('Error editing Category', error.message);
      req.flash('message', 'Error editing category. Please try again');
      req.flash('messageType', 'error');  
      res.redirect('/categories');  
     }
 });

 router.post('/delete', isAuthAdmin, async function(req, res, next) {
  
  // #swagger.tags = ['Categories']
  // #swagger.description = "Deletes a category."
  // #swagger.produces = ['JSON']
  // #swagger.responses = [200, 404, 500]

  const {categoryId} = req.body;
  
  try {
    
    const result = await categoryService.deleteCategory(req);

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
