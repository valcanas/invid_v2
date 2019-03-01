const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const SECRET = require('../config/salt').salt; // get our config file

function verifyToken(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.header('x-access-token');
  if (!token)
    return res.status(403).send({ auth: false, message: 'Bad credentials' });

  // verifies secret and checks exp
  jwt.verify(token, SECRET, function(err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

function verifyParam(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.params.token;
  if (!token)
    res.status(403).render('error', {message: { text: 'Not authorized', type: 'error' }, error:{status:"Authorization failed", stack: 'This resource is protected. Please, login first'}});

  // verifies secret and checks exp
  jwt.verify(token, SECRET, function(err, decoded) {
    if (err)
      res.status(500).render('error', {message: { text: 'Bad credentials', type: 'error' }});
    // if everything is good, save to request for use in other routes
    req.user_id = decoded.id.user_id;
    req.user_name = decoded.id.user_name;
    req.token = token;
    next();
  });
}


function buildToken (key) {
  // create a token
  var token = jwt.sign({ id: key }, SECRET, {
    //expiresIn: 86400 // expires in 24 hours
    expiresIn: 3600 // expires in 1 hour
  });
  return token;
}

module.exports = {
  verifyToken,
  buildToken,
  verifyParam,
};