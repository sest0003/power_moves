module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
      role: Sequelize.DataTypes.STRING,
    },{});

    
    Role.associate = (models) => {
        Role.hasMany(models.User, { foreignKey: 'roleId' });
};
    return Role;
};