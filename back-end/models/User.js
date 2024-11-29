module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      firstname: Sequelize.DataTypes.STRING,
      lastname: Sequelize.DataTypes.STRING,
      userame: Sequelize.DataTypes.STRING,
      email: Sequelize.DataTypes.STRING,
      adress: Sequelize.DataTypes.STRING,
      phone: Sequelize.DataTypes.INTEGER,
      password: Sequelize.DataTypes.BLOB,
      salt: Sequelize.DataTypes.BLOB,
    },{});

    User.associate = (models) => {
        User.belongsTo(models.Role, { foreignKey: 'role_id' });
        User.belongsTo(models.Membership, { foreignKey: 'membership_id' });
        User.hasMany(models.Order, { foreignKey: 'user_id' });
};
    return User;
};