var express = require('express');
var router = express.Router();
const Token = require('../../auth/Token')

const chatroomRouter = require('./chat-room');

//router.use();

router.get('/chat-room/:token', Token.verifyParam, function(req, res)  {
  res.render('chat-room',{token: req.params.token});
});

router.use(Token.verifyParam);

router.get('/', function(req, res) {
  res.render('user',{});
});



module.exports = router;