module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define('Brand', {
      name: Sequelize.DataTypes.STRING,
    },{});

    Brand.associate = (models) => {
        Brand.hasMany(models.Product, { foreignKey: 'brand_id' });
};

    return Brand;
};