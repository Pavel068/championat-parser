var express = require('express');
var dateformat = require('dateformat');
var router = express.Router();

var Parser = require('../lib/parser');

/*
Routes for live results (no auth)
 */

router.get('/live/:sport/:date', function (req, res, next) {
    let nextDate = dateformat(new Date(req.params.date).getTime() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser(req.params.sport, req.params.date);
    parser.parse()
        .then((response) => {
            response.nextDate = nextDate;
            response.section = 'main';
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

router.get('/live/:sport', function (req, res, next) {
    let nowDate = dateformat(Date.now(), 'yyyy-mm-dd');
    let nextDate = dateformat(Date.now() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser(req.params.sport, nowDate);
    parser.parse()
        .then((response) => {
            response.nextDate = nextDate;
            response.section = 'main';
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

router.get('/', function (req, res, next) {
    let nowDate = dateformat(Date.now(), 'yyyy-mm-dd');
    let nextDate = dateformat(Date.now() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser('football', nowDate);
    parser.parse()
        .then((response) => {
            response.nextDate = nextDate;
            response.section = 'main';
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
        section: 'login'
    });
});

router.post('/login', function (req, res, next) {

});

/*
Routes for required auth pages
 */

router.get('/teams', function (req, res, next) {
    res.render('teams', {
        section: 'teams'
    });
});

router.get('/teams/:team', function (req, res, next) {
    res.render('team', {
        section: 'teams'
    });
});

router.get('/players', function (req, res, next) {
    res.render('players', {
        section: 'players'
    });
});

router.get('/stat', function (req, res, next) {
    res.render('stat', {
        section: 'stat'
    });
});

module.exports = router;
