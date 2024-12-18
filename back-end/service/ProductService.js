const { Sequelize } = require("sequelize");

class ProductService {
    constructor(db) {
        this.client = db.sequelize;
        this.Product = db.Product;
    }

    async getOne(id) {
        return this.Product.findOne({
            where: {id: id}
        })
    }

    async updateStock(id, amount) {
        const product = await this.Product.findOne({ where: { id: id} });
        if (!product) return null;
        if(product.stock > 0) {
            product.stock = product.stock - amount;
        }
        await product.save();
        return product;
    }

    async create(name, description, imageUrl, unitPrice, stock, brandId, categoryId) {
        return this.Product.create({
            name: name,
            description: description,
            imageUrl: imageUrl,
            unitPrice: unitPrice,
            stock: stock,
            isDeleted: 0, 
            brandId: brandId,
            categoryId: categoryId
        });
    }

    async getAll() {
        return await this.Product.findAll({
            attributes: [
                'id',
                'name',
                'description',
                'imageUrl',
                'unitPrice',
                'stock',
                'isDeleted',
                'brandId',
                'categoryId',
                // I deconstruct the response so it fits in the frondend table
                //   <%= product.Brand %>
                [Sequelize.col('Brand.name'), 'Brand'],
                [Sequelize.col('Category.name'), 'Category'],
            ],
            
            include: [
                {
                    model: this.client.models.Brand,
                    attributes: [],
                    as: 'Brand',
                },
                {
                    model: this.client.models.Category,
                    attributes: [],
                    as: 'Category',
                },
            ],
            raw: true // makes the result not nested
       });
    }

    async getByCategory(categoryId) {
        try {
            const query = `
                SELECT 
                    products.*,
                    brands.name AS Brand,
                    categories.name AS Category
                FROM products
                LEFT JOIN brands ON products.brandId = brands.id
                LEFT JOIN categories ON  products.categoryId = categories.id
                WHERE products.categoryId = ?
            `;

            const products = await this.client.query(query, {
                replacements: [categoryId] // I use replecments to protect against direct query injections
            });

            return products.length > 0 ? products : null;

            } catch (error) {
                throw new Error("Database error occured");
            }
       }

       async getByPartialName(productName) {
        try {
            const query = `
                SELECT 
                    products.*,
                    brands.name AS Brand,
                    categories.name AS Category
                FROM products
                LEFT JOIN brands ON products.brandId = brands.id
                LEFT JOIN categories ON  products.categoryId = categories.id
                WHERE products.name LIKE ?
                `;

            const [products] = await this.client.query(query, {
                replacements: [`${productName}%`] // I use % to find names that starts with some letters, 
                // I use replecments to protect against query injections
            });

            return products.length > 0 ? products : null;

            } catch (error) {
                console.error("sql error", error);
                throw new Error("Database error occured");
            }
       }

       async getByBrand(brandId) {
        try {
            const query = `
                SELECT 
                    products.*,
                    brands.name AS Brand,
                    categories.name AS Category
                FROM products
                LEFT JOIN brands ON products.brandId = brands.id
                LEFT JOIN categories ON  products.categoryId = categories.id
                WHERE products.brandId = ?
            `;

            const products = await this.client.query(query, {
                replacements: [brandId] // I use replecments to protect against direct query injections
            });

            return products.length > 0 ? products : null;

            } catch (error) {
                console.error("sql error", error);
                throw new Error("Database error occured");
            }
       }

       
    

    async updateProduct(productId, update) {
        
        // Validate allowedfields
        const allowedFields = ["name", "description", "imageUrl", "unitPrice", "stock", "isDeleted"];
        
        const filteredData = Object.keys(update)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = update[key];
            return obj;
        }, {});

        // Convert params to numbers
        let ConvertedId = parseInt(productId, 10);  
       
        const product = await this.Product.findOne({ where: { id: ConvertedId } });
        if (!product) return null;

        product.set(filteredData);
        await product.save();

        return product;
    }



}



module.exports = ProductService;