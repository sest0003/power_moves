module.exports = (sequelize, Sequelize) => {
    const Player = sequelize.define('Player', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      age: Sequelize.DataTypes.INTEGER,
      photo: Sequelize.DataTypes.STRING,
      nationality: {
        type: Sequelize.STRING,
        allowNull: false
      },
      injured: Sequelize.DataTypes.BOOLEAN,
      games: Sequelize.DataTypes.INTEGER,
      inLineup: Sequelize.DataTypes.INTEGER,
      fieldMinutes: Sequelize.DataTypes.INTEGER,
      rating: Sequelize.DataTypes.FLOAT,
      position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      captain: Sequelize.DataTypes.BOOLEAN,
      shots: Sequelize.DataTypes.INTEGER,
      shotsOnGoal: Sequelize.DataTypes.INTEGER,
      passes: Sequelize.DataTypes.INTEGER,
      keyPasses: Sequelize.DataTypes.INTEGER,
      accuracyPasses: Sequelize.DataTypes.INTEGER,
      interceptions: Sequelize.DataTypes.INTEGER,
      blocks: Sequelize.DataTypes.INTEGER,
      duels: Sequelize.DataTypes.INTEGER,
      wonDuels: Sequelize.DataTypes.INTEGER,
      dribbleAtempts: Sequelize.DataTypes.INTEGER,
      dribblesSucceeded: Sequelize.DataTypes.INTEGER,
      yellowCards: Sequelize.DataTypes.INTEGER,
      RedCards: Sequelize.DataTypes.INTEGER,
      wonPenalityShots: Sequelize.DataTypes.INTEGER,
      causedPenality: Sequelize.DataTypes.INTEGER,
      missedPenality: Sequelize.DataTypes.INTEGER,
      scoredPenality: Sequelize.DataTypes.INTEGER,
      savedPenality: Sequelize.DataTypes.INTEGER,
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'teams',
          key: 'team_id'
        }
      },
      stars: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5
        }
      },
      moves: {
        type: Sequelize.INTEGER,
        validate: {
          min: 2,
          max: 5
        }
      }
    }, {
      tableName: 'players',
      timestamps: true,
      underscored: true
    });

    Player.associate = function(models) {
        Player.belongsTo(models.Team, {
            foreignKey: 'team_id',
            targetKey: 'teamId',
            as: 'Team'
        });
    };

    return Player;
};