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
            include: [
                {
                    model: this.client.models.Brand,
                    as: 'Brand',
                    attributes: ['name'],
                },
                {
                    model: this.client.models.Category,
                    as: 'Category',
                    attributes: ['name'],
                },
            ],
       });
    }

    async getByCategory(categoryId) {
        try {
            const query = `
                SELECT *
                FROM products
                WHERE categoryId = ?
            `;

            const products = await this.client.query(query, {
                replacements: [categoryId] // I use replecments to protect against direct query injections
            });

            return products.length > 0 ? products : null;

            } catch (error) {
                throw new Error("Database error occured");
            }
       }

       async getByBrand(brandId) {
        try {
            const query = `
                SELECT *
                FROM products
                WHERE brandId = ?
            `;

            const products = await this.client.query(query, {
                replacements: [brandId] // I use replecments to protect against direct query injections
            });

            return products.length > 0 ? products : null;

            } catch (error) {
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