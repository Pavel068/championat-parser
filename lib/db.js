const mysql = require('mysql');

class DB {
    constructor() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        this.connection.connect();
    }

    addMatch() {

    }

    addTeam() {

    }

    getTeam() {

    }
}