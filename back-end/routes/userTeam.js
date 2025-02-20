const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');

router.get('/', auth, async function(req, res, next) {
    try {
        // Hämta användarens team_id
        const user = await db.User.findByPk(req.user.id);
        
        if (!user.team_id) {
            req.flash('error', 'You have not selected a team yet');
            return res.redirect('/teams');
        }

        // Hämta team information
        const team = await db.Team.findOne({
            where: { teamId: user.team_id }
        });

        if (!team) {
            req.flash('error', 'Team not found');
            return res.redirect('/teams');
        }

        // Hämta alla spelare för teamet
        const players = await db.Player.findAll({
            where: { 
                team_id: user.team_id
            },
            order: [['rating', 'DESC']]
        });

        // Beräkna total moves
        let totalMoves = players.reduce((sum, player) => sum + (player.moves || 0), 0);

        res.render('userTeam', { 
            players,
            totalMoves,
            team,
            user: req.user
        });

    } catch (error) {
        console.error('Error in userTeam route:', error);
        req.flash('error', 'Error fetching team data');
        res.redirect('/teams');
    }
});

module.exports = router; 