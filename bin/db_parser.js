require('dotenv').load();

const Parser = require('../lib/parser');
const DB = require('../lib/db');
const dateFormat = require('dateformat');

let db = new DB();

// set dates
let startTime = new Date('2017-01-01').getTime();
let endTime = Date.now();

// sports
let sports = ['volleyball', 'basketball', 'football', 'hockey'];

sports.forEach((sport) => {
    let prs = new Parser();
    for (var time = startTime; time <= endTime; time += 86400000) {
        prs.parse(sport, dateFormat(time, 'yyyy-mm-dd'))
            .then((response) => {
                for (let tournament in response.tournaments) {
                    response.tournaments[tournament].matches.forEach((match) => {
                        match.teams.forEach((team) => {
                            db.addMatch(sport, response.tournaments[tournament], match);
                        });
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
});