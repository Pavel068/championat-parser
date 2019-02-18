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

    addMatch(sport, tournament, match) {
        // Add match info
        let matchInfo = {
            sport: sport,
            team_1: match.teams[0].name,
            team_2: match.teams[1].name,
            score_1: match.result.detailed.goal1,
            score_2: match.result.detailed.goal2,
            start_time: match.date + ' ' + match.time,
            tournament_name: tournament.name_tournament,
            tournament_stage: match.group.name,
        };

        if (matchInfo.tournament_name === undefined)
            matchInfo.tournament_name = tournament.name;

        this.connection.query('INSERT INTO matches SET ?', matchInfo, (error, results, fields) => {
            if (error && error.code !== 1062)
                console.log(error.message);
        });
    }

    getUser(login, password) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM users WHERE login = ? AND password = ?', [
                login, password
            ], (error, results, fields) => {
                if (results.length === 1) {
                    resolve({
                        id: results[0].id
                    })
                } else {
                    reject({
                        error: 1
                    })
                }
            });
        });
    }

    getTeam() {

    }
}

module.exports = DB;