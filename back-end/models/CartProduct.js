module.exports = (sequelize, Sequelize) => {
    const CartProduct = sequelize.define('CartProduct', {},
        {});
    
    CartProduct.associate = (models) => {
        CartProduct.belongsTo(models.Product, { foreignKey: 'productId' });
        CartProduct.belongsTo(models.Cart, { foreignKey: 'cartId' });

    };
    return CartProduct;
};