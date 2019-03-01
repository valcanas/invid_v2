const User = require('../models/user');
const Shortfilm = require('../models/shortfilm');
const crypt = require('../util/crypt-util');
const Token = require('../auth/Token');
const jwt = require('jsonwebtoken');
const videoService = require('../services/videoService');
const voteService = require('../services/voteService');



// ------------------- TODO PARA EL /ADMIN


// -GET- CHECK ADMIN LOGIN ---> LUEGO DE COMPROBAR, RENDER DE LA PAGINA

exports.getLoginAdmin = (req, res, next) => {
    res.render('indexFilmUp', {
      pageTitle: 'Admin Area',
      path: '/admin',
      admin: false
    });
  };

// postLoginAdmin

exports.doAdminLogin = (req, res, next) => {
    const username = req.body.user_name; // attr Name = "user" en la view 
    const password = req.body.user_pass;
    User.login(username, password)
    .then(([row]) => {
        if (row.length !== 1) {
                res.render('indexFilmUp', { 
                    pageTitle: 'main_page',
                    error: 'try again',
                    message: false,
                    admin: false
                });
          } else {
            const userlog = row[0];
            const dbPwd = userlog.user_pass;
            const pwd = req.body.user_pass;
            const cryptPasswd = crypt.encrypt(pwd);
            if (cryptPasswd !== dbPwd && userlog.user_name !== "Admin") {
                res.render('indexFilmUp', { 
                    pageTitle: 'main_page',
                    error: 'try again',
                    message: false,
                    admin: false
                });
            } else {
              let token = Token.buildToken(userlog)
              console.log('este es el id del usuario: ',userlog.user_id)
              console.log('Este es el token del login:  ',token);
                res.redirect(`/admin/film/${token}`);
              console.log(token);
            }
          }
            })
        .catch(err => console.log(err));
    };


exports.viewAdminPage = (req, res, next) => {
    let userIDLogged = req.user_id;
    let token = req.token;
    let user_name = req.user_name;
    Shortfilm.fetchAll()
        .then(([shortfilms]) => {
            console.log(shortfilms);
            res.render('indexFilm', {       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
                token: token,
                shortfilms: shortfilms,
                admin: true
            });
        })
        .catch(err => console.log(err));


};


// -POST- HABILITAR LAS PELICULAS ---> ENABLE=1 ON CLICK Y MARCAR LAS YA HABILITADAS



  exports.postDisableFilm = (req, res, next) => {
    let token = req.token;
    const filmid = req.params.id;
    console.log(filmid);
    Shortfilm.disableFilm(filmid)
    .then(() => {
        return Shortfilm.fetchAll()
        .then(([shortfilms]) => {
            console.log(shortfilms);
            res.render('indexFilm', { 
                token: token,      // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
                shortfilms: shortfilms,
                admin: true
            });
        });
    });
  };

  exports.postEnableFilm = (req, res, next) => {
    let token = req.token;
    const filmid = req.params.id;
    console.log(filmid);
    Shortfilm.enableFilm(filmid)
    .then(() => {
        return Shortfilm.fetchAll()
        .then(([shortfilms]) => {
            console.log(shortfilms);
            res.render('indexFilm', {
                token: token,       // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
                shortfilms: shortfilms,
                admin: true
            });
        });
    });
  };



  exports.postDeleteFilm = (req, res, next) => {
    let token = req.token;
    const filmid = req.params.id;
    Shortfilm.deleteById(filmid)
    //res.redirect('/admin/film');
    .then(() => {
        return Shortfilm.fetchAll()
        .then(([shortfilms]) => {
            console.log(shortfilms);
            res.render('indexFilm', {  
                token: token,     // en el ejs hacer un for loop que recorra los elementos de los videos para ponerlos en pantalla
                shortfilms: shortfilms,
                admin: true
            });
        });
    });
};
  


