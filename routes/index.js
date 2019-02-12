var express = require('express');
var router = express.Router();

var Parser = require('../lib/parser');

router.get('/:sport/:date', function (req, res, next) {
    let parser = new Parser(req.params.sport, req.params.date);
    parser.parse()
        .then((response) => {
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

router.get('/:sport/', function (req, res, next) {
    let parser = new Parser(req.params.sport, '2019-02-11');
    parser.parse()
        .then((response) => {
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});

router.get('/', function (req, res, next) {
    let parser = new Parser('football', '2019-02-11');
    parser.parse()
        .then((response) => {
            res.render('index', response);
        })
        .catch((error) => {
            res.render('index', error);
        });
});


module.exports = router;
