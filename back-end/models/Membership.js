module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define('Membership', {
      type: Sequelize.DataTypes.STRING,
      disconunt: Sequelize.DataTypes.INTEGER,
    },{});

    Membership.associate = (models) => {
        Membership.hasMany(models.User, { foreignKey: 'membership_id' });
};

    return Membership;
};