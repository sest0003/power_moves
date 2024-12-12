class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
    }

    async getOne(id) {
        return this.Brand.findOne({
            where: {id: id}
        })
    }

    async create(name) {
        return this.Product.create({
            name: name
        });
    }

    async getAll() {
        return await this.Product.findAll({});
    }

    
    async updateName(id, name) {

        const brand = await this.Brand.findOne({ where: { id: id} });
        if (!brand) {
            return null;
        }

        brand.name = name;

        try {
            await brand.save();
            return brand;
        } catch (error) {
            throw new Error('failed updating brand name', error)
        }
    }

    async deleteBrand(id) {
        const brand = await this.Brand.destroy({ where: { id: id } });
        return brand > 0;
    }


}

module.exports = BrandService;