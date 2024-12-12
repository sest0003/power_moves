class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async getOne(id) {
        return this.Category.findOne({
            where: {id: id}
        })
    }

    async create(name) {
        return this.Category.create({
            name: name
        });
    }

    async getAll() {
        return await this.Category.findAll({});
    }

    
    async updateName(id, name) {
        const category = await this.Category.findOne({ where: { id: id} });

        if (!category) {
            return null;
        }

        category.name = name;

        try {
            await Category.save();
            return Category;
        } catch (error) {
            throw new Error('failed updating category name', error)
        }
    }

    async deleteCategory(id) {
        const category = await this.Category.destroy({ where: { id: id } });
        return category > 0;
    }


}

module.exports = CategoryService;