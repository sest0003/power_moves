module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
      orderNumber: Sequelize.DataTypes.STRING,
      numOfProducts: Sequelize.DataTypes.INTEGER,
      totalAmount: Sequelize.DataTypes.FLOAT,
      orderStatusId: Sequelize.DataTypes.INTEGER,
      membershipId: Sequelize.DataTypes.INTEGER,
    },{});
    
    Order.associate = (models) => {
        Order.belongsTo(models.User, { foreignKey: 'userId' });
        Order.belongsTo(models.OrderStatus, { foreignKey: 'orderStatusId' });
        Order.belongsTo(models.Cart, { foreignKey: 'cartId' });
        Order.hasMany(models.OrderProduct, { foreignKey: 'orderId', as: 'orderProducts' });
};
    return Order;
};