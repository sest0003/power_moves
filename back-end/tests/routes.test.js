const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()
const URL = 'http://localhost:3000';

const bodyParser = require("body-parser");


const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const populateRouter = require('../routes/populate')
const productRouter = require('../routes/products');
const cartRouter = require('../routes/carts');
const orderRouter = require('../routes/orders');
const brandRouter = require('../routes/brands');
const categoryRouter = require('../routes/categories');
const membershipRouter = require('../routes/memberships');


app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/init', populateRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/brands', brandRouter);
app.use('/categories', categoryRouter);
app.use('/memberships', membershipRouter);

// Testing to create a new brand, category and product 
describe("testing-add-brand-category-product", () => {
    let token, newBrand, newCategory, newProduct, updatedBrand, updatedCategory;
    
    // Login
    beforeAll(async () => {
        try {
            const credentials = { email: "admin@noroff.no", password: "P@ssword2023" };
            const response = await request(URL).post('/auth/login').send(credentials);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('token');
            token = response.body.data.token;
            expect(token).toBeDefined();
        } catch (error) {
            console.error("error login", error)
        }
    });

    // Add Category
    test('POST categories/add - success', async () => {
        try {
            newCategory = { name: "TEST_CATEGORY" }
            const response = await request(URL)
            .post('/categories/add/')
            .set('Authorization', 'Bearer ' + token)
            .send(newCategory);
            
            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('name', newCategory.name);
            expect(response.body.data).toHaveProperty('id');
            newCategory.id = response.body.data.id; // // set the id on the new objekt so i can use the data in later tests

        } catch (error) {
            console.error("error add categories", error)
        }  
    });
   
   // Add Brand
    test('POST brands/add - success', async () => {
        try {
            newBrand = {name: "TEST_BRAND" }
            const response = await request(URL)
            .post('/brands/add/')
            .set('Authorization', 'Bearer ' + token)
            .send(newBrand);
            
            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('name', newBrand.name);
            expect(response.body.data).toHaveProperty('id');
            newBrand.id = response.body.data.id; // // set the id on the new objekt so i can use the data in later tests

        } catch (error) {
            console.error("error add new Brand", error)
        }  
    });
  
    // Add Product with brandid and categoryid
    test('POST products/add - success', async () => {
        try {
             newProduct = {
                    name: "TEST_PRODUCT", 
                    description: "testdesc", 
                    imageUrl: "test.se", 
                    unitPrice: 99.99, 
                    stock: 100, 
                    brandId: newBrand.id, // the id from the testObjet
                    categoryId: newCategory.id // the id from the testObjet
            }
            
            const response = await request(URL)
            .post('/products/add/')
            .set('Authorization', 'Bearer ' + token)
            .send(newProduct);
            
            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toMatchObject(newProduct);
            expect(response.body.data).toHaveProperty('id');
            newProduct.id = response.body.data.id; // set the id on the new objekt so i can use the data in later tests
          
        } catch (error) {
            console.error("error add new product", error)
        }  
    });
  
     // Get Product
    test('GET /products/ - success', async () => {
        try {
            const response = await request(URL)
            .get(`/products/${newProduct.id}`)
            .set('Authorization', 'Bearer ' + token)

            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data.data.id).toBe(newProduct.id);
            expect(response.body.data.data.brandId).toBe(newBrand.id);
            expect(response.body.data.data.categoryId).toBe(newCategory.id);

        } catch (error) {
            console.error("error add new product", error)
        }  
    });

    // update Brand
    test('PUT /brands/edit - success', async () => {
    try {
        const updatedName = { name: 'TEST_BRAND2' }
        const response = await request(URL)
        .put(`/brands/edit/${newCategory.id}`)
        .set('Authorization', 'Bearer ' + token)
        .send(updatedName)
       
        // Response
        expect(response.body).toHaveProperty('data');
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toHaveProperty('name', updatedName.name);
        expect(response.body.data).toHaveProperty('id');
        newBrand.name = updatedName.name;
        

    } catch (error) {
        console.error("error add new product", error)
    }  
});

    // update category
    test('PUT /categories/edit - success', async () => {
        try {
            const updatedName = { name: 'TEST_CATEGORY2' }
            const response = await request(URL)
            .put(`/brands/edit/${newBrand.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(updatedName)
           
            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty('name', updatedName.name);
            expect(response.body.data).toHaveProperty('id');
            newBrand.name = updatedName.name;
            
    
        } catch (error) {
            console.error("error add new product", error)
        }  
    });

    // Get updatedProduct
    test('GET /products/ - success', async () => {
        try {
            const response = await request(URL)
            .get(`/products/${newProduct.id}`)
            .set('Authorization', 'Bearer ' + token)

            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data.data.id).toBe(newProduct.id);
            expect(response.body.data.data.brandId).toBe(newBrand.id);
            expect(response.body.data.data.categoryId).toBe(newCategory.id);

        } catch (error) {
            console.error("error add new product", error)
        }  
    });

    // Delete Product
    test('PUT /products/edit - success', async () => {
        try {
            deletedBrand = { isDeleted: 1 }
            const response = await request(URL)
            .put(`/products/edit/${newProduct.id}`)
            .set('Authorization', 'Bearer ' + token)
            .send(deletedBrand)
            
            // Response
            expect(response.body).toHaveProperty('data');
            expect(response.statusCode).toBe(200);
            expect(response.body.data).toHaveProperty("isDeleted", true); // 1 = true. 

        } catch (error) {
            console.error("error add new product", error)
        }  
    });


        

});

