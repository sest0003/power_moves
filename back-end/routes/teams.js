let express = require('express');
let router = express.Router();
let db = require("../models");
let TeamService = require("../service/TeamService")
let teamService = new TeamService(db);


router.get('/', async function(req, res, next) {
   
  try {
       
        const teams = await db.Team.findAll({
            include: [{
                model: db.Player,
                as: 'Players',
                attributes: ['moves']
            }],
            order: [['rank', 'ASC']]
        });

        console.log('Raw team data:', teams[0]); // Logga första teamet för att se strukturen

        // Beräkna total moves för varje lag
        const teamsWithTotalMoves = teams.map(team => {
            const totalMoves = team.Players.reduce((sum, player) => {
                return sum + (player.moves || 0);
            }, 0);
            
            const plainTeam = team.get({ plain: true }); // Konvertera till plain object
            return {
                ...plainTeam,
                totalMoves: totalMoves
            };
        });

        console.log('Processed team data:', teamsWithTotalMoves[0]); // Logga första processade teamet

        if(!teams) {
            req.flash('message', 'failed to find teams. Please try again');
            req.flash('messageType', 'error');
            return res.redirect('/');  
        }
  
        res.render('teams', { teams: teamsWithTotalMoves });
  
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});  



module.exports = router;
