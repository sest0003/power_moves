module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('Product', {
      name: Sequelize.DataTypes.STRING,
      description: Sequelize.DataTypes.TEXT,
      imageUrl: Sequelize.DataTypes.STRING,
      unitPrice: Sequelize.DataTypes.FLOAT,
      stock: Sequelize.DataTypes.INTEGER,
      isDeleted: Sequelize.DataTypes.BOOLEAN,
    },{});

    Product.associate = (models) => {
        Product.belongsTo(models.Brand, { foreignKey: 'brandId' });
        Product.belongsTo(models.Category, { foreignKey: 'categoryId' });
};
    return Product;
};