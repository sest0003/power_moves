const jwt = require('jsonwebtoken');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        points: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        teamId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            field: 'team_id',
            references: {
                model: 'teams',
                key: 'team_id'
            }
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true,
    });

    // Instance method to generate JWT token
    User.prototype.generateAuthToken = function() {
        return jwt.sign(
            { 
                id: this.id,
                email: this.email,
                name: this.name 
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    };

    // Definiera associations här om det behövs
    User.associate = function(models) {
        User.belongsTo(models.Team, {
            foreignKey: 'team_id',
            targetKey: 'teamId',
            as: 'team'
        });
    };

    return User;
};