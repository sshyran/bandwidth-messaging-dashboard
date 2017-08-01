var path = require('path');
var express = require('express');
var router = express.Router();
var Bandwidth = require('node-bandwidth');
var config = require('../config.js')
const timeout = ms => new Promise(res => setTimeout(res, ms))

var client = new Bandwidth({
  userId    : config.userId,
  apiToken  : config.apiToken,
  apiSecret : config.apiSecret
});

// Serve static files from the React app
router.use(express.static(path.join(__dirname, '../frontend/build')));

router.get('/api/messages', async (req, res) => {
  console.log(req.query);
  req.query.size = 15;
  try {
    let messages = await client.Message.list(req.query);
    let sortKey = {};
    //console.log(messages.nextLink);
    if (messages.hasNextPage) {
      sortKey = messages.nextLink;
    }
    const response = {
      messages: messages.messages,
      sortKey
    }
    res.send(response);
  }
  catch (e) {
    console.log(e.message);
    res.statusMessage = e.message;
    res.status(e.statusCode).end();
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

module.exports = router;