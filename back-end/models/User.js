module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      firstname: Sequelize.DataTypes.STRING,
      lastname: Sequelize.DataTypes.STRING,
      username: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      adress: Sequelize.DataTypes.STRING,
      phone: Sequelize.DataTypes.INTEGER,
      password: Sequelize.DataTypes.BLOB,
      salt: Sequelize.DataTypes.BLOB,
      sumOfUnits: Sequelize.DataTypes.INTEGER,
    },{});

    User.associate = (models) => {
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
        User.belongsTo(models.Membership, { foreignKey: 'membershipId' });
        User.hasMany(models.Order, { foreignKey: 'userId' });
};
    return User;
};