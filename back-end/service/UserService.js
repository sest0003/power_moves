class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async getOne(email) {
        return this.User.findOne({
            where: {Email: email}
        })
    }

    async create(firstname, lastname, username, email, adress, phone, password, salt) {
        return this.User.create({
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            adress: adress,
            phone: phone,
            password: password,
            salt: salt
        });
    }
}

module.exports = UserService;