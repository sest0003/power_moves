const { success } = require("jsend");
const crypto = require('crypto');

class PopulateService {
    constructor(db) {
        this.client = db.sequelize;
        this.Team = db.Team;
        this.User = db.User;
        this.Player = db.Player;
    }

    async populateDatabase() {
        try {
            // TEAMS
            const teams = await this.Team.findAll();

            if (!teams || teams.length === 0) {
                // Populate db PL teams
                await this.pushPLTeams();  
            }

            // Hämta alla teams igen efter att de har skapats
            const updatedTeams = await this.Team.findAll();
            
            // Skapa spelare för varje team
            for (const team of updatedTeams) {
                await this.pushPlayers(team.teamId);
            }

            return { success: true, message: "Database populated successfully." };
    
        } catch (error) {
            console.error("❌ populateDatabase Error:", error.message);
            return { success: false, message: `Error while populating database: ${error.message}` };
        }
    }

    async pushPLTeams() {
    
        const url = "https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=2024";
        
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'e24f23fcc2mshc1562da673b426fp114861jsnf1893587ac93',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        };
        
        try {
            const response = await fetch(url, options);
    
            const result = await response.json();
    
            // Check if the response contains data
            if (!result.response || result.response.length === 0) {
            console.warn("⚠️ No data found for the selected season.");
            return false;
        }
        
        const leagueId = result.response[0]?.league?.id;

        const standings = result.response[0]?.league?.standings?.[0];
        
        if (!standings || standings.length === 0) {
            console.warn("⚠️ Standings data is missing in API response.");
            return false;
        }
        
        // Put data från api in the database
        for (const standing of standings) {
            const teamData = standing.team;
            
            await this.Team.findOrCreate({
                where: { name: teamData.name }, 
                defaults: {
                    name: teamData.name,
                    rank: standing.rank,
                    points: standing.points,
                    logo: teamData.logo,
                    leagueId: leagueId,
                    teamId: teamData.id
                }
            });
        }


        } catch (error) {
            console.error('Fetch error', error);
            throw error;
        }
        };

    async pushPlayers(teamId) {
        const url = `https://api-football-v1.p.rapidapi.com/v3/players?team=${teamId}&season=2023`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'e24f23fcc2mshc1562da673b426fp114861jsnf1893587ac93',
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!result.response || result.response.length === 0) {
                console.warn("⚠️ No data found for the selected season.");
                return false;
            }

            // Hitta team baserat på teamId från API
            const team = await this.Team.findOne({
                where: { teamId: teamId }
            });

            if (!team) {
                console.warn(`⚠️ No team found with teamId: ${teamId}`);
                return false;
            }

            for (const playerEntry of result.response) {
                const playerData = playerEntry.player;
                const playerStats = playerEntry.statistics;
    
                let totalGames = 0, totalLineups = 0, totalMinutes = 0;
                let totalRating = 0.0, numOfRatings = 0;
                let totalShots = 0, totalShotsOnGoal = 0;
                let totalPasses = 0, totalKeyPasses = 0, totalAccuracyPasses = 0;
                let totalInterceptions = 0, totalBlocks = 0;
                let totalDuels = 0, totalWonDuels = 0;
                let totalDribbleAttempts = 0, totalDribblesSucceeded = 0;
                let totalYellowCards = 0, totalRedCards = 0;
                let totalWonPenalties = 0, totalCausedPenalties = 0;
                let totalMissedPenalties = 0, totalScoredPenalties = 0, totalSavedPenalties = 0;
                let isCaptain = false;
                let totalGoals = 0;
                let totalAssists = 0;
                let totalSaves = 0;
    
                for (const stat of playerStats) {
                    if (stat.games) {
                        totalGames += stat.games.appearences || 0;
                        totalLineups += stat.games.lineups || 0;
                        totalMinutes += stat.games.minutes || 0;
    
                        if (stat.games.rating !== null && stat.games.rating !== undefined) {
                            totalRating += parseFloat(stat.games.rating);
                            numOfRatings++;
                        }
    
                        if (stat.games.captain) {
                            isCaptain = true;
                        }
                    }
    
                    if (stat.shots) {
                        totalShots += stat.shots.total || 0;
                        totalShotsOnGoal += stat.shots.on || 0;
                    }
    
                    if (stat.passes) {
                        totalPasses += stat.passes.total || 0;
                        totalKeyPasses += stat.passes.key || 0;
                        totalAccuracyPasses += stat.passes.accuracy || 0;
                    }
    
                    if (stat.tackles) {
                        totalInterceptions += stat.tackles.interceptions || 0;
                        totalBlocks += stat.tackles.blocks || 0;
                    }
    
                    if (stat.duels) {
                        totalDuels += stat.duels.total || 0;
                        totalWonDuels += stat.duels.won || 0;
                    }
    
                    if (stat.dribbles) {
                        totalDribbleAttempts += stat.dribbles.attempts || 0;
                        totalDribblesSucceeded += stat.dribbles.success || 0;
                    }
    
                    if (stat.cards) {
                        totalYellowCards += stat.cards.yellow || 0;
                        totalRedCards += stat.cards.red || 0;
                    }
    
                    if (stat.penalty) {
                        totalWonPenalties += stat.penalty.won || 0;
                        totalCausedPenalties += stat.penalty.commited || 0;
                        totalMissedPenalties += stat.penalty.missed || 0;
                        totalScoredPenalties += stat.penalty.scored || 0;
                        totalSavedPenalties += stat.penalty.saved || 0;
                    }

                    if (stat.goals) {
                        totalGoals += stat.goals.total || 0;
                        totalAssists += stat.goals.assists || 0;
                        totalSaves += stat.goals.saves || 0;
                    }
                }
    
                const averageRating = numOfRatings > 0 ? totalRating / numOfRatings : 0.0;
    
                await this.Player.findOrCreate({
                    where: { name: playerData.name },
                    defaults: {
                        name: playerData.name,
                        age: playerData.age,
                        photo: playerData.photo,
                        nationality: playerData.nationality,
                        injured: playerData.injured,
                        games: totalGames,
                        inLineup: totalLineups,
                        fieldMinutes: totalMinutes,
                        rating: averageRating,
                        position: playerStats[0]?.games?.position || "Unknown",
                        captain: isCaptain,
                        shots: totalShots,
                        shotsOnGoal: totalShotsOnGoal,
                        passes: totalPasses,
                        keyPasses: totalKeyPasses,
                        accuracyPasses: totalAccuracyPasses,
                        interceptions: totalInterceptions,
                        blocks: totalBlocks,
                        duels: totalDuels,
                        wonDuels: totalWonDuels,
                        dribbleAtempts: totalDribbleAttempts,
                        dribblesSucceeded: totalDribblesSucceeded,
                        yellowCards: totalYellowCards,
                        RedCards: totalRedCards,
                        wonPenalityShots: totalWonPenalties,
                        causedPenality: totalCausedPenalties,
                        missedPenality: totalMissedPenalties,
                        scoredPenality: totalScoredPenalties,
                        savedPenality: totalSavedPenalties,
                        goals: totalGoals,
                        assists: totalAssists,
                        saves: totalSaves,
                        team_id: team.teamId
                    }
                });
            }
    
        } catch (error) {
            console.error('Fetch error', error);
            throw error;
        }
    };

    async calculatePlayerStars() {
        try {
            const players = await this.Player.findAll();
            
            for (const player of players) {
                let totalScore = 0;
                
                // 1. General Skills (max 20 poäng) - gäller alla positioner
                const generalScore = this.calculateGeneralSkills(player);
                totalScore += Math.min(20, generalScore);
                
                // 2-5. Positionsspecifika skills (max 60 poäng)
                let positionScore = 0;
                switch(player.position.toLowerCase()) {
                    case 'goalkeeper':
                        positionScore = this.calculateGoalkeeperSkills(player);
                        break;
                    case 'defender':
                        positionScore = this.calculateDefenderSkills(player);
                        break;
                    case 'midfielder':
                        positionScore = this.calculateMidfielderSkills(player);
                        break;
                    case 'attacker':
                        positionScore = this.calculateAttackerSkills(player);
                        break;
                    default:
                        console.warn(`Unknown position: ${player.position}`);
                }
                totalScore += Math.min(60, positionScore);
                
                // 6. Extra Skills (max 20 poäng) - bonus för ovanliga prestationer
                const extraScore = this.calculateExtraSkills(player);
                totalScore += Math.min(20, extraScore);
                
                // Konvertera totalpoäng till stjärnor (0-5)
                // Max poäng är nu 100 (20 + 60 + 20)
                const stars = Math.max(0, Math.min(5, Math.round(totalScore / 20)));
                
                await player.update({ stars });
            }
            
            return { success: true, message: "Stars calculated and updated successfully" };
        } catch (error) {
            console.error("Error calculating stars:", error);
            return { success: false, message: error.message };
        }
    }

    calculateGeneralSkills(player) {
        let score = 0;
        
        // Ålder (optimal ålder ger mer poäng)
        if (player.age >= 25 && player.age <= 32) score += 5;
        else if (player.age >= 21 && player.age <= 24) score += 3;
        
        // Speltid
        score += Math.min(5, (player.fieldMinutes / 90) * 0.2);
        
        // Lagkapten
        if (player.captain) score += 5;
        
        // Startspelare
        if (player.inLineup > 15) score += 5;
        
        return score;
    }

    calculateGoalkeeperSkills(player) {
        let score = 0;
        
        // Räddade straffar
        score += player.savedPenality * 10;
        
        // Clean sheets skulle vara bra att ha här
        
        // Passningsspel (viktigt för moderna målvakter)
        const passAccuracy = player.passes > 0 ? (player.accuracyPasses / 100) : 0;
        score += passAccuracy * 10;
        
        return score;
    }

    calculateDefenderSkills(player) {
        let score = 0;
        
        // Defensiva aktioner
        score += player.interceptions * 0.5;
        score += player.blocks * 0.5;
        
        // Dueller
        const duelSuccess = player.duels > 0 ? (player.wonDuels / player.duels) * 20 : 0;
        score += duelSuccess;
        
        // Passningssäkerhet
        const passAccuracy = player.passes > 0 ? (player.accuracyPasses / 100) * 15 : 0;
        score += passAccuracy;
        
        return score;
    }

    calculateMidfielderSkills(player) {
        let score = 0;
        
        // Passningsspel
        const passAccuracy = player.passes > 0 ? (player.accuracyPasses / 100) * 20 : 0;
        score += passAccuracy;
        score += player.keyPasses * 0.5;
        
        // Dueller
        const duelSuccess = player.duels > 0 ? (player.wonDuels / player.duels) * 15 : 0;
        score += duelSuccess;
        
        // Dribblingar
        const dribbleSuccess = player.dribbleAtempts > 0 ? 
            (player.dribblesSucceeded / player.dribbleAtempts) * 15 : 0;
        score += dribbleSuccess;
        
        return score;
    }

    calculateAttackerSkills(player) {
        let score = 0;
        
        // Skott och mål
        const shotAccuracy = player.shots > 0 ? (player.shotsOnGoal / player.shots) * 20 : 0;
        score += shotAccuracy;
        score += player.scoredPenality * 3;
        
        // Lägg till mål och assists i beräkningen
        score += player.goals * 2;  // 2 poäng per mål
        score += player.assists * 1.5;  // 1.5 poäng per assist
        
        const dribbleSuccess = player.dribbleAtempts > 0 ? 
            (player.dribblesSucceeded / player.dribbleAtempts) * 20 : 0;
        score += dribbleSuccess;
        
        score += player.keyPasses * 0.5;
        
        return score;
    }

    calculateExtraSkills(player) {
        let score = 0;
        
        switch(player.position.toLowerCase()) {
            case 'defender':
                score += player.scoredPenality * 5;
                score += player.keyPasses * 1;
                score += player.goals * 3;  // Extra poäng för mål som försvarare
                break;
                
            case 'midfielder':
                score += player.blocks * 1;
                score += player.scoredPenality * 3;
                score += player.assists * 2;  // Extra poäng för assists som mittfältare
                score += player.goals * 2;    // Lägg till poäng för mål som mittfältare
                break;
                
            case 'attacker':
                score += player.interceptions * 1;
                score += player.blocks * 1;
                score += player.goals * 1.5;  // Bonus för mål som forward
                break;
                
            case 'goalkeeper':
                score += player.keyPasses * 2;
                score += player.saves * 2;  // Poäng för räddningar
                break;
        }
        
        return score;
    }

    async calculateMoves() {
        try {
            const players = await this.Player.findAll();
            console.log("Total players found:", players.length);
            
            for (const player of players) {
                let moves = 2; // Default värde för spelare utan stars
                
                console.log(`Player: ${player.name}, Current stars: ${player.stars}`);
                
                // Beräkna moves baserat på stars
                switch(Number(player.stars)) {  // Konvertera till number för säkerhets skull
                    case 1:
                        moves = 3;
                        break;
                    case 2:
                        moves = 4;
                        break;
                    case 3:
                    case 4:
                    case 5:
                        moves = 5;
                        break;
                    default:
                        moves = 2;
                }
                
                console.log(`Setting moves to: ${moves} for player ${player.name}`);
                
                // Använd force: true för att säkerställa uppdateringen
                await this.Player.update(
                    { moves: moves },
                    { 
                        where: { id: player.id },
                        force: true 
                    }
                );
            }
            
            // Verifiera uppdateringarna
            const updatedPlayers = await this.Player.findAll({
                attributes: ['name', 'stars', 'moves']
            });
            console.log("Updated players:", updatedPlayers.map(p => ({
                name: p.name,
                stars: p.stars,
                moves: p.moves
            })));
            
            return { success: true, message: "Moves calculated and updated successfully" };
        } catch (error) {
            console.error("Error calculating moves:", error);
            return { success: false, message: error.message };
        }
    }

}





module.exports = PopulateService;