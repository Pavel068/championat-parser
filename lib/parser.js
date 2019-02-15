const axios = require('axios');

class Parser {
    constructor() {
        this.args = [];
        this.url = '';
        this.result = {};
    }

    parse(sport, date) {
        this.args = [sport, date];
        this.url = `https://www.championat.com/stat/${sport}/${date}.json`;
        this.result = {};

        return new Promise((resolve, reject) => {
            axios.get(this.url)
                .then((response) => {
                    if (response.data.matches.length === 0) {
                        this.result = {
                            label: this.args[0],
                            isEmpty: true
                        };
                        resolve(this.result);
                    }

                    this.result = response.data.matches[this.args[0]];
                    this.result.isEmpty = false;
                    resolve(this.result);
                })
                .catch((error) => {
                    this.result = {
                        error: 1
                    };
                    reject(this.result);
                });
        });
    }
}

module.exports = Parser;