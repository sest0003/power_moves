const axios = require('axios');
const express = require('express');

class PlayerService {
    constructor(db) {
        this.client = db.sequelize;
        this.Player = db.Player;
    }

    async getPlayersById(id) {
        return await this.Player.findAll({
            where: { teamId: id}
        });
    }
}

module.exports = TeamService;
