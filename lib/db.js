const mysql = require('mysql');

class DB {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost' || process.env.DB_HOST,
            user: 'root' || process.env.DB_USER,
            password: '' || process.env.DB_PASSWORD,
            database: 'champparser' || process.env.DB_NAME
        });

        this.connection.connect();
    }

    addTeam(sport, team) {
        this.connection.query('INSERT INTO teams SET ?', {
            sport: sport,
            name: team.name,
            icon_link: team.icon_link
        }, (error, results, fields) => {
            console.log(error);
        });
    }

    addMatch(sport, match) {
        // Add match info
        this.connection.query('INSERT INTO matches SET ?', {
            sport: sport,
            team_1: match.teams[0].name,
            team_2: match.teams[1].name,
            goals_1: match.result.detailed.goal1,
            goals_2: match.result.detailed.goal2,
            start_time: match.start_time,
            tournament_name: match.tournament_name,
            tournament_stage: match.tournament_stage,
        }, (error, results, fields) => {
            console.log(error);
        });
    }

    getTeam() {

    }
}

module.exports = DB;