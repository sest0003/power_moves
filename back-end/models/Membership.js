module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
      type: Sequelize.DataTypes.STRING,
      discount: Sequelize.DataTypes.INTEGER,
    },{});

    Membership.associate = (models) => {
        Membership.hasMany(models.User, { foreignKey: 'membership_id' });
};

    return Membership;
};