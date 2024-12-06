module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
      name: Sequelize.DataTypes.STRING,
    },{});

    Category.associate = (models) => {
        Category.hasMany(models.Product, { foreignKey: 'categoryId' });
};

    return Category;
};