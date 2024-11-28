module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
        isCheckedOut: Sequelize.DataTypes.BOOLEAN,
        numOfProducts: Sequelize.DataTypes.INTEGER,
        userId: Sequelize.DataTypes.INTEGER,
        

    },{});
    
    Cart.associate = (models) => {
        Cart.belongsTo(models.User, { foreignKey: 'user_id' });
        Cart.hasMany(models.CartProduct, { foreignKey: 'cart_id' });
        Cart.hasOne(models.Order, { foreignKey: 'cart_id' });

    };
    return Cart;
};