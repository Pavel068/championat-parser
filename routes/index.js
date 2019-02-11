var express = require('express');
var router = express.Router();

var Parser = require('../lib/parser');

router.get('/', function(req, res, next) {
  let parser = new Parser('football', '2019-02-10');
  parser.parse()
      .then((response) => {
        res.render('index', response);
      })
      .catch((error) => {
        res.render('index', error);
      });
});

module.exports = router;
