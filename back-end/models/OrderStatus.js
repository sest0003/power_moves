module.exports = (sequelize, Sequelize) => {
    const OrderStatus = sequelize.define('OrderStatus', {
      status: Sequelize.DataTypes.STRING,
    },{});
    
    OrderStatus.associate = (models) => {
        OrderStatus.hasMany(models.Order, { foreignKey: 'order_status_id' });
};

    return OrderStatus;
};