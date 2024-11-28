module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      firstName: Sequelize.DataTypes.STRING,
      LastName: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      phone: Sequelize.DataTypes.INTEGER,
      password: Sequelize.DataTypes.STRING,
      salt: Sequelize.DataTypes.STRING,
      roleId: Sequelize.DataTypes.INTEGER,
      membershipId: Sequelize.DataTypes.INTEGER,
    },{});

    User.associate = (models) => {
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
        User.belongsTo(models.Membership, { foreignKey: 'membership_id' });
        User.hasMany(models.Order, { foreignKey: 'user_id' });
};
    return User;
};