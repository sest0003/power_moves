const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');  // Importera auth middleware

router.get('/:teamId', async function(req, res, next) {
    try { 
        const teamId = req.params.teamId;
        console.log('Looking for players with teamId:', teamId);

        // Hämta team baserat på team_id kolumnen
        const team = await db.Team.findOne({
            where: { team_id: teamId }  // Ändra från teamId till team_id för att matcha kolumnnamnet
        });

        if (!team) {
            console.log('Team not found');
            req.flash('error', 'Team not found');
            return res.redirect('/teams');
        }

        const players = await db.Player.findAll({
            where: { 
                team_id: teamId
            },
            order: [['rating', 'DESC']]
        });

        // Beräkna total moves
        let totalMoves = players.reduce((sum, player) => sum + (player.moves || 0), 0);

        console.log(`Found ${players.length} players for team ${team.name}`);

        res.render('players', { 
            players,
            totalMoves,
            team,
            user: req.user || null
        });

    } catch (error) {
        console.error('Error in players route:', error);
        req.flash('error', 'Error fetching players');
        res.redirect('/teams');
    }
});

// Ny route för att välja team
router.post('/:teamId/pick', auth, async function(req, res) {
    try {
        const teamId = req.params.teamId;
        const team = await db.Team.findOne({
            where: { teamId: teamId }  // Använd teamId istället för team_id
        });

        if (!team) {
            return res.status(404).json({ 
                success: false, 
                message: 'Team not found' 
            });
        }

        const userId = req.user.id;

        // Uppdatera användarens team
        await db.User.update(
            { team_id: teamId },  // Använd det mottagna teamId
            { where: { id: userId } }
        );

        req.flash('success', 'Team selected successfully!');
        res.json({ success: true });
    } catch (error) {
        console.error('Error picking team:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error selecting team' 
        });
    }
});

module.exports = router;
