class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
        this.Membership = db.Membership;
        this.Role = db.Role;
    }

    async getAll() {
        return await this.User.findAll({});
    }

    async getOneByEmail(email) {
        return this.User.findOne({
            where: {Email: email}
        })
    }

    async getOneById(id) {
        return this.User.findOne({
            where: {id: id},
            include: [
                {
                model: this.Membership, attributes: ['discount']
                },
                { 
                model: this.Role, attributes: ['role']
                }
            ]
        });
    }

    async create(userData) {
        console.log("User data in service:", userData);
        return this.User.create({
            firstname: userData.firstname,
            lastname: userData.lastname,
            username: userData.username,
            email: userData.email,
            adress: userData.adress,
            phone: userData.phone,
            password: userData.password,
            salt: userData.salt,
            membershipId: 1,
            roleId: 2,
            sumOfUnits: 0
        });
    }

   async updateMembership(user) {
        if(user.sumOfUnits >= 15 && user.sumOfUnits <= 30 ) {
            user.membershipId = 2;
        } else if (user.sumOfUnits > 30) {
            user.membershipId = 3;       
        } 
        await user.save();
     }

     async updateRole(userId, update) {
    
        // Validate allowedfields
        const allowedFields = ["roleId", "membershipId"];
        
        const filteredData = Object.keys(update)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = update[key];
            return obj;
        }, {});
    
        // Convert params to numbers
        let ConvertedId = parseInt(userId, 10);  
       
        const user = await this.User.findOne({ where: { id: ConvertedId } });
        if (!user) return null;
    
        user.set(filteredData);
        await user.save();
    
        return user;
    }


}

module.exports = UserService;