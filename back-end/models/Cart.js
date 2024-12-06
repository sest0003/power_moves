module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
        isCheckedOut: Sequelize.DataTypes.BOOLEAN,
        numOfProducts: Sequelize.DataTypes.INTEGER,
        totalAmount: Sequelize.DataTypes.FLOAT,
    },{});
    
    Cart.associate = (models) => {
        Cart.belongsTo(models.User, { foreignKey: 'userId' });
        Cart.hasMany(models.CartProduct, { foreignKey: 'cartId', as: 'cartProducts' });
        Cart.hasOne(models.Order, { foreignKey: 'cartId' });

    };
    return Cart;
};