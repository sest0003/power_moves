module.exports = (sequelize, Sequelize) => {
    const OrderProduct = sequelize.define('OrderProduct', {},
        {});
    
        OrderProduct.associate = (models) => {
            OrderProduct.belongsTo(models.Product, { foreignKey: 'productId' });
            OrderProduct.belongsTo(models.Order, { foreignKey: 'orderId' });
    };
    
    return OrderProduct;
};