var express = require('express');
var dateformat = require('dateformat');
var crypto = require('crypto');
var router = express.Router();

var Parser = require('../lib/parser');
var DB = require('../lib/db');

/*
Routes for live results (no auth)
 */

router.get('/live/:sport/:date', function (req, res, next) {
    let nextDate = dateformat(new Date(req.params.date).getTime() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser();
    parser.parse(req.params.sport, req.params.date)
        .then((response) => {
            response.nextDate = nextDate;
            response.section = 'main';
            response.user = req.cookies;
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

router.get('/live/:sport', function (req, res, next) {
    let nowDate = dateformat(Date.now(), 'yyyy-mm-dd');
    let nextDate = dateformat(Date.now() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser();
    parser.parse(req.params.sport, nowDate)
        .then((response) => {
            response.nextDate = nextDate;
            response.section = 'main';
            response.user = req.cookies;
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

router.get('/', function (req, res, next) {
    let nowDate = dateformat(Date.now(), 'yyyy-mm-dd');
    let nextDate = dateformat(Date.now() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser();
    parser.parse('football', nowDate)
        .then((response) => {
            response.nextDate = nextDate;
            response.section = 'main';
            response.user = req.cookies;
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

/*
Routes for login view and handler
 */

router.get('/login', function (req, res, next) {
    res.render('login', {
        section: 'login',
        user: req.cookies,
    });
});

router.post('/login', function (req, res, next) {
    let db = new DB();
    db.getUser(req.body.login, crypto.createHash('sha256').update(req.body.password).digest('hex'))
        .then((response) => {
            res.cookie('userId', response.id);
            res.redirect('/');
        })
        .catch((error) => {
            res.render('login', {
                section: 'login',
                user: req.cookies,
                error: 1
            });
        });
});

router.get('/logout', function (req, res, next) {
    if (req.cookies.userId !== undefined) {
        res.clearCookie('userId');
        res.redirect('/');
    }
});

/*
Routes for required auth pages
 */

router.get('/teams/:sport/:team', function (req, res, next) {
    let db = new DB();
    db.getTeamDetails(req.params.sport, req.params.team)
        .then((response) => {
            res.render('team', {
                section: 'teams',
                user: req.cookies,
                label: req.params.sport,
                teamName: req.params.team,
                results: response
            });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get('/teams/:sport', function (req, res, next) {
    let db = new DB();
    db.getTeams(req.params.sport)
        .then((response) => {
            res.render('teams', {
                section: 'teams',
                user: req.cookies,
                teams: response,
                label: req.params.sport,
            });
        })
        .catch((error) => {

        });
});

router.get('/teams', function (req, res, next) {
    let db = new DB();
    db.getTeams('football')
        .then((response) => {
            res.render('teams', {
                section: 'teams',
                user: req.cookies,
                teams: response,
                label: 'football'
            });
        })
        .catch((error) => {

        });
});

router.get('/stat/:sport', function (req, res, next) {
    let db = new DB();
    db.getMainStat(req.params.sport)
        .then((response) => {
            res.render('stat', {
                section: 'stat',
                stat: response,
                label: req.params.sport,
                user: req.cookies,
            });
        })
        .catch((error) => {

        });
});

router.get('/stat', function (req, res, next) {
    let db = new DB();
    db.getMainStat('football')
        .then((response) => {
            res.render('stat', {
                section: 'stat',
                stat: response,
                label: 'football',
                user: req.cookies,
            });
        })
        .catch((error) => {

        });
});

module.exports = router;
