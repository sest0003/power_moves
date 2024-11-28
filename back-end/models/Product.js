module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
      name: Sequelize.DataTypes.STRING,
      description: Sequelize.DataTypes.TEXT,
      imageUrl: Sequelize.DataTypes.STRING,
      unitPrice: Sequelize.DataTypes.FLOAT,
      stock: Sequelize.DataTypes.INTEGER,
      isDeleted: Sequelize.DataTypes.BOOLEAN,
      brandId: Sequelize.DataTypes.INTEGER,
      categoryId: Sequelize.DataTypes.INTEGER,
    },{});

    Product.associate = (models) => {
        Product.belongsTo(models.Brand, { foreignKey: 'brand_id' });
        Product.belongsTo(models.Category, { foreignKey: 'category_id' });
        Product.hasMany(models.CartProduct, { foreignKey: 'product_id' });
        Product.hasMany(models.OrderProduct, { foreignKey: 'product_id' });
};
    return Product;
};