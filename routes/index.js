var path = require('path');
var express = require('express');
var router = express.Router();
var Bandwidth = require('node-bandwidth');
var config = require('../config.js')

var client = new Bandwidth({
  userId    : config.userId,
  apiToken  : config.apiToken,
  apiSecret : config.apiSecret
});

// Serve static files from the React app
router.use(express.static(path.join(__dirname, '../frontend/build')));

router.get('/api/messages', (req, res) => {
  client.Message.list(req.query).then(function (messages) {
    res.send(messages);
  }).catch(function(err) {
    res.status(err.statusCode).send(err);
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

module.exports = router;
