var express = require('express');
var dateformat = require('dateformat');
var router = express.Router();

var Parser = require('../lib/parser');

router.get('/login', function (req, res, next) {
    res.render('login', {});
});

router.get('/live/:sport/:date', function (req, res, next) {
    let nextDate = dateformat(new Date(req.params.date).getTime() - 86400000, 'yyyy-mm-dd');
    let parser = new Parser(req.params.sport, req.params.date);
    parser.parse()
        .then((response) => {
            response.nextDate = nextDate;
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
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});


module.exports = router;
