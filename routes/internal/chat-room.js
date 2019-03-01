var express = require('express');
var router = express.Router();
const Token = require('../../auth/Token')

router.get('/:token', Token.verifyParam, function(req, res){
  res.render('chat-room',{token: req.params.token});
});

module.exports = router;