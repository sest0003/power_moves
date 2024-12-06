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

    async create(name, description, imageUrl, unitPrice, stock) {
        return this.Product.create({
            name: name,
            description: description,
            imageUrl: imageUrl,
            unitPrice: unitPrice,
            stock: stock
        });
    }
}

module.exports = ProductService;