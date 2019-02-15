require('dotenv').load();

const Parser = require('../lib/parser');
const DB = require('../lib/DB');
const dateFormat = require('dateformat');

let db = new DB();
let prs = new Parser();

// set dates
let startTime = new Date('2017-01-01').getTime();
let endTime = Date.now();

for (let time = startTime; time <= endTime; time += 86400000) {
    prs.parse('football', dateFormat(time, 'yyyy-mm-dd'))
        .then((response) => {
            for (let tournament in response.tournaments) {
                response.tournaments[tournament].matches.forEach((match) => {
                    match.teams.forEach((team) => {
                        db.addTeam('football', {
                            name: team.name,
                            icon_link: team.icon
                        });
                    });
                });
            }
        })
        .catch((error) => {

        });
}