const path = require('path');

const express = require('express');

const Token = require('../auth/Token');

//SERVICES



//CONTROLLERS
const adminController = require('../controllers/admin');
const userController = require('../controllers/user');
const shortfilmController = require('../controllers/shortfilm');
const mainController = require('../controllers/main');



const router = express.Router();

router.get('/', mainController.getIntroPage);

// raiz => GET
router.get('/main/auth', shortfilmController.getShortfilmEnabled);
router.post('/main/auth', userController.doUserLogin); //ok
router.get('/main/auth/voting/:token', Token.verifyParam, shortfilmController.votefilmEnabled);
router.post('/main/auth/voting/:token', Token.verifyParam, userController.voteVideo);
router.get('/main/auth/voting/results/', Token.verifyParam, shortfilmController.getMostVoted);


//router.get('/main/auth/result/:token', Token.verifyParam, shortfilmController.findVotes);
// /upload => POST


router.get('/register', userController.fillUserRegister); //ok
router.post('/register/post', userController.saveNewUser); //ok
router.get('/register/upload/:token', Token.verifyParam, userController.fillFormToAddFilm); //ok
router.post('/register/upload/:token', Token.verifyParam, userController.saveAddedFilm); //ok





// /user => GET/POST
router.get('/admin', adminController.getLoginAdmin); //ok
router.post('/admin/film/', adminController.doAdminLogin); //ok
router.get('/admin/film/:token', Token.verifyParam, adminController.viewAdminPage);
router.post('/admin/film/delete/:id/auth/:token', Token.verifyParam, adminController.postDeleteFilm); //ok
router.post('/admin/film/enable/:id/auth/:token', Token.verifyParam, adminController.postEnableFilm); //ok
router.post('/admin/film/disable/:id/auth/:token', Token.verifyParam, adminController.postDisableFilm); //ok


module.exports = router; 