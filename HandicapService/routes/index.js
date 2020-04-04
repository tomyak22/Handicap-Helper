var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const rounds = require('../modules/rounds');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/rounds', (req, res, next) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(rounds.list));
});

module.exports = router;
