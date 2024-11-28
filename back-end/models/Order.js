module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
      orderNumber: Sequelize.DataTypes.STRING,
      orderStatusId: Sequelize.DataTypes.INTEGER,
      cartId: Sequelize.DataTypes.INTEGER,
      cartProductId: Sequelize.DataTypes.INTEGER,
      userId: Sequelize.DataTypes.INTEGER,
    },{});
    
    Order.associate = (models) => {
        Order.belongsTo(models.User, { foreignKey: 'user_id' });
        Order.belongsTo(models.OrderStatus, { foreignKey: 'order_status_id' });
        Order.belongsTo(models.Cart, { foreignKey: 'cart_id' });
        Order.hasMany(models.OrderProduct, { foreignKey: 'order_id' });
};
    return Order;
};