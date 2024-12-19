class MembershipService {
    constructor(db) {
        this.client = db.sequelize;
        this.Membership = db.Membership;
    }

    async getOne(id) {
        return this.Membership.findOne({
            where: {id: id}
        })
    }

    async create(type, discount) {
        return this.Membership.create({
            type: type,
            discount: discount
        });
    }

    async getAll() {
        return await this.Membership.findAll({});
    }

    
    async update(membershipId, update) {
        
        // Validate allowedfields
        const allowedFields = ["type", "discount"];
        
        const filteredData = Object.keys(update)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = update[key];
            return obj;
        }, {});

        // Convert params to numbers
        let ConvertedId = parseInt(membershipId, 10);  
       
        const membership = await this.Membership.findOne({ where: { id: ConvertedId } });
        if (!membership) return null;

        membership.set(filteredData);
        await membership.save();

        return membership;
    }

    async deleteBrand(id) {
        const brand = await this.Brand.destroy({ where: { id: id } });
        return brand > 0;
    }


}

module.exports = MembershipService;