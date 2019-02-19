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
                    this.connection.end();
                    resolve({
                        id: results[0].id
                    })
                } else {
                    this.connection.end();
                    reject({
                        error: 1
                    })
                }
            });
        });
    }

    getTeams(sport) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT DISTINCT team_1 FROM matches WHERE sport = ? ORDER BY team_1 ASC', [
                sport
            ], (error, results, fields) => {
                if (!error) {
                    var response = [];
                    var responsePart = {
                        l: '',
                        teams: []
                    };
                    var firstLetter = '';
                    results.forEach((item) => {
                        if (firstLetter !== item.team_1.charAt(0)) {
                            firstLetter = item.team_1.charAt(0);
                            if (responsePart.teams.length)
                                response.push(responsePart);
                            responsePart = {
                                l: item.team_1.charAt(0),
                                teams: []
                            };
                            responsePart.teams.push(item.team_1);
                        } else {
                            responsePart.l = firstLetter;
                            responsePart.teams.push(item.team_1);
                        }
                    });
                    this.connection.end();
                    resolve(response);
                } else {
                    this.connection.end();
                    reject({
                        error: 1
                    })
                }
            });
        });
    }

    getTeamDetails(sport, team) {
        return new Promise((resolve, reject) => {
            this.connection.query('SELECT * FROM matches WHERE sport = ? AND (team_1 = ? OR team_2 = ?) ORDER BY start_time DESC', [
                sport, team, team
            ], (error, results, fields) => {
                if (error) {
                    this.connection.end();
                    reject({
                        error: 1
                    });
                } else {
                    this.connection.end();
                    resolve(results);
                }
            });
        });
    }

    getMainStat(sport) {
        return new Promise((resolve, reject) => {
            // get top home teams
            let query = 'SELECT m.team_1,m.sport, (SELECT COUNT(*) FROM matches WHERE score_1>score_2 AND team_1=m.team_1 AND sport=m.sport AND m.start_time > NOW()-INTERVAL 1 MONTH) AS homeWins FROM matches AS m WHERE m.sport = ? GROUP BY m.team_1 ORDER BY homeWins DESC LIMIT 10';
            this.connection.query(query, [
                sport
            ], (error, results, fields) => {
                if (error) {
                    this.connection.end();
                    reject({
                        error: 1
                    });
                } else {
                    this.connection.end();
                    resolve(results);
                }
            });
        });
    }
}


module.exports = DB;