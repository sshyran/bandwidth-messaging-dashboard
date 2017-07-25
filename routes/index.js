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
  req.query.size = 1000;
  console.log(req.query);
  try {
    let messages = await client.Message.list(req.query);
    let allMessages = messages.messages;
    let hasNextPage = messages.hasNextPage;
    while (hasNextPage) {
      messages = await messages.getNextPage();
      allMessages = allMessages.concat(messages.messages);
      hasNextPage = messages.hasNextPage;
      await timeout(1000);
    }
    res.send(allMessages);
  }
  catch (e) {
    res.status(e.statusCode).send(e);
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

module.exports = router;
