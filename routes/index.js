var express = require('express');
var auth = require('./auth.js');
var voices = require('./voices.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);
router.post('/register', auth.register);

/*
 * Routes that can be accessed only by autheticated users
 */
router.get('/api/v1/voices', voices.getAll);

module.exports = router;
