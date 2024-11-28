module.exports = (sequelize, Sequelize) => {
    const OrderProduct = sequelize.define('OrderProduct', {
        productId: Sequelize.DataTypes.INTEGER,
        orderId: Sequelize.DataTypes.INTEGER,
        

    },{});
    
        OrderProduct.associate = (models) => {
            OrderProduct.belongsTo(models.Product, { foreignKey: 'product_id' });
            OrderProduct.belongsTo(models.Order, { foreignKey: 'order_id' });
    };
    
    return OrderProduct;
};