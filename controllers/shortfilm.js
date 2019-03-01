const User = require('../models/user');
const Shortfilm = require('../models/shortfilm');
const videoService = require('../services/videoService');
const voteService = require('../services/voteService');


exports.getShortfilmEnabled = (req, res, next) => {
  let token = req.params.token;
    Shortfilm.findEnabled()
      .then(([shortfilms]) => {
        res.render('indexAll', {
          token: token,       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
          user: true,
          credentials: false,  
          shortfilms: shortfilms,
        });
      })
      .catch(err => console.log(err));
  };


  exports.votefilmEnabled = (req, res, next) => {
    let token = req.params.token;
      Shortfilm.findEnabled()
        .then(([shortfilms]) => {
          res.render('votes', {
            token: token,       
            user: true,  
            credentials: true, 
            shortfilms: shortfilms,
          });
        })
        .catch(err => console.log(err));
    };

    exports.getMostVoted = (req, res, next) => {
      let token = req.params.token;
      voteService.findMostVoted()
      .then( result => { 
        res.send(result);
        console.log(result); 
      } )
      .catch(err => console.log(err));    
    };
  
  
 


 