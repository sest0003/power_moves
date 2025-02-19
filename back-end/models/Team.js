module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define('Team', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.DataTypes.STRING,
        rank: Sequelize.DataTypes.INTEGER,
        points: Sequelize.DataTypes.INTEGER,
        logo: Sequelize.DataTypes.STRING,
        leagueId: Sequelize.DataTypes.INTEGER,
        teamId: {
            type: Sequelize.DataTypes.INTEGER,
            unique: true,
            allowNull: false,
            field: 'team_id'
        }
    }, {
        tableName: 'teams',
        timestamps: true,
        underscored: true
    });

    Team.associate = function(models) {
        Team.hasMany(models.Player, {
            foreignKey: 'team_id',
            sourceKey: 'teamId',
            as: 'Players'
        });
    };

    return Team;
};