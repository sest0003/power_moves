module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      firstname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      adress: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      password: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false
      },
      salt: {
        type: Sequelize.DataTypes.BLOB,
        allowNull: false
      },
      sumOfUnits: {
        type: Sequelize.DataTypes.INTEGER
      }
    },{});

    User.associate = (models) => {
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
        User.belongsTo(models.Membership, { foreignKey: 'membershipId' });
        User.hasMany(models.Order, { foreignKey: 'userId' });
};
    return User;
};