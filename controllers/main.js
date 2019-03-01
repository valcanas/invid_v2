const User = require('../models/user');
const Shortfilm = require('../models/shortfilm');


//INTRO PAGE
exports.getIntroPage = (req, res, next) => {
    res.render('intro', { 
        pageTitle: 'Intro Page',
    })
  };
