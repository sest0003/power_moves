module.exports = (sequelize, Sequelize) => {
    const CartProduct = sequelize.define('CartProduct', {
        productId: Sequelize.DataTypes.INTEGER,
        cartId: Sequelize.DataTypes.INTEGER,
        

    },{});
    
    CartProduct.associate = (models) => {
        CartProduct.belongsTo(models.Product, { foreignKey: 'product_id' });
        CartProduct.belongsTo(models.Cart, { foreignKey: 'cart_id' });

    };
    return CartProduct;
};