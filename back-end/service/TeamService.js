const axios = require('axios');
const express = require('express');

class TeamService {
    constructor(db) {
        this.client = db.sequelize;
        this.Team = db.Team;
    }

    async getTeamsById(id) {
        return await this.Team.findAll({
            where: { leagueId: id}
        });
    }
}

module.exports = TeamService;
