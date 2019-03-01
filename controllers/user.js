const User = require('../models/user');
const Shortfilm = require('../models/shortfilm');
const crypt = require('../util/crypt-util');
const Token = require('../auth/Token');
const jwt = require('jsonwebtoken');
const videoService = require('../services/videoService');
const voteService = require('../services/voteService');


// (/)
exports.doUserLogin = (req, res, next) => {
    const username = req.body.user_name; // attr Name = "user" en la view 
    const password = req.body.user_pass;
    User.login(username, password)
    .then(([row]) => {
      console.log('resultado: ' + JSON.stringify(row[0]));
      if (row.length !== 1) {
        Shortfilm.findEnabled()
        .then(([shortfilms]) => {
          res.render('indexAll', {       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
            message: {type: 'error', text: 'Usuario o Contraseña incorrectos'},  
            shortfilms: shortfilms,
            path: '/main/auth',
            user: false,
          });
        })
        .catch(err => console.log(err));
      } else {
        const userlog = row[0];
        const dbPwd = userlog.user_pass;
        const pwd = req.body.user_pass;
        const cryptPasswd = crypt.encrypt(pwd);
        if (cryptPasswd !== dbPwd || userlog.user_name === "Admin") {
          Shortfilm.findEnabled()
          .then(([shortfilms]) => {
            res.render('indexAll', {       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
              message: {type: 'error', text: 'Usuario o Contraseña incorrectos'},  
              shortfilms: shortfilms,
              path: '/main/auth',
              user: false,
            });
          })
          .catch(err => console.log(err));
          console.log('Pass encriptada: ' + cryptPasswd);
          console.log('Pass de database' + dbPwd);
        } else {
          let token = Token.buildToken(userlog)
          console.log('este es el id del usuario: ',userlog.user_id)
          console.log('Este es el token del login:  ',token);
            res.redirect(`/register/upload/${token}`);
          console.log(token);
        }
      }
        })
    .catch(err => console.log(err));
};


// -POST- SUBIR PELICULA Y RECIBIR MENSAJE DE PENDIENTE
exports.fillUserRegister = (req, res, next) => {
    res.render('registerUser', {
      pageTitle: 'Registro de Usuario',
      userflag: false,
    });
  };


exports.saveAddedFilm = (req, res, next) => {
    let userIDLogged = req.user_id;
    let token = req.token;

    const title = req.body.title;
    const url = req.body.url;
    const sinopsis = req.body.sinopsis;
    const year_release = req.body.year_release;
    const gen_id = req.body.gen_id;
    const user_id = userIDLogged;
    const thumbnail = req.body.thumbnail
    const shortfilm = new Shortfilm(null, title, url, sinopsis, year_release, null, user_id, gen_id, null, thumbnail); //user_id vas el user id que esta activo
    console.log(shortfilm);
    shortfilm
      .saveVideo()
      .then(() => {
        res.redirect(`/register/upload/${token}`);
        Shortfilm.findLastVideo(title, url, user_id)
    .then(([result]) => {
      console.log('esto es lo que se trae la req ' + result[0]);
      console.log(result[0]);
      var id_video = result[0].video_id;

      var formulario = req.body; 
      formulario.user_id = user_id;
      formulario.video_id = id_video;
      console.log(formulario);
      videoService.create(formulario)
        .then( result => { 
          console.log(result); 
        } )
        .catch( err => { res.send({"error": true, "detail":err }) });
      });    
  }).catch(err => console.log(err));
    
};






  exports.fillFormToAddFilm = (req, res, next) => {
    let userIDLogged = req.user_id;
    let token = req.token;
    let user_name = req.user_name;
    console.log('ID de user logged ' + userIDLogged)
    Shortfilm.findFilmByUserId(userIDLogged)
    .then(([shortfilms]) => {
      res.render('register', {
        token: token,
        user_name: user_name,
        shortfilms: shortfilms,
        userflag: true,
      });
      console.log('este es el token que se lleva: ', req.params.token);
    });
      
     
  };

  
  exports.getShortfilmByUserId = (req, res, next) => {
    Shortfilm.findFilmByUserId(user_id)
      .then(([shortfilms]) => {
        res.render('register', {       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
          user: true,  
          shortfilms: shortfilms,
        });
      })
      .catch(err => console.log(err));
  };



  exports.saveNewUser = (req, res, next) => {
    const username = req.body.user_name; // attr Name = "user" en la view , el user name será el correo electronico
    const password = req.body.user_pass;
    const cryptPasswd = crypt.encrypt(password);
    const user = new User (null, username, cryptPasswd);
    console.log(user);
    user
    .register()
    .then(() => {
      let lastUserRegister = User.lastSign(username, cryptPasswd);
      return lastUserRegister;
    })
    .then(([row]) => {
      let lastUser = row[0];
      let token = Token.buildToken(lastUser)
      console.log('Este es el utimo registrado: ',lastUser);
      console.log('Este es el ID del ultimo registro:  ',lastUser.user_id);
      console.log('Este es el token:  ',token);

        res.redirect(`/register/upload/${token}`);
        console.log(`valor del token:  ${token}`);
    })
    .catch(err => console.log(err));
};
/*
exports.voteVideoForm = (req, res, next) => {
      res.render('votes', {       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
        user: true,  
        shortfilms: shortfilms,
      })
};
*/
exports.voteVideo = (req, res, next) => {
  let userIDLogged = req.user_id;
  let token = req.token;
 
  const filmid = req.body.film_id;
  const starElement = req.body.stars;
  var votos = req.body; 
  votos.user_vote = userIDLogged;
  votos.id_video = filmid;
  votos.star_vote = starElement; //ok
  console.log(votos);
  console.log(filmid);

  voteService.create(votos)
  .then( result => { 
    res.render('votes', {
      token: token,       
      vote: true, 
      shortfilms: shortfilms,
    });
    console.log(result); 
  } )
  .catch(err => console.log(err));
};