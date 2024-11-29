module.exports = (sequelize, Sequelize) => {
    const OrderStatus = sequelize.define('OrderStatus', {
      typeOfStatus: Sequelize.DataTypes.STRING,
    },{});
    
    OrderStatus.associate = (models) => {
        OrderStatus.hasMany(models.Order, { foreignKey: 'order_status_id' });
};

    return OrderStatus;
};