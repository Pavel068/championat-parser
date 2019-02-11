const axios = require('axios');

class Parser {
    constructor(sport, date) {
        this.args = [sport, date];
        this.url = `https://www.championat.com/stat/${sport}/${date}.json`;
        this.result = {};
    }

    parse() {
        return new Promise((resolve, reject) => {
            axios.get(this.url)
                .then((response) => {
                    this.result = response.data.matches[this.args[0]];
                    resolve(this.result);
                })
                .catch((error) => {
                    console.log(error);
                    this.result = {
                        error: 1
                    };
                    reject(this.result);
                });
        });
    }
}

module.exports = Parser;