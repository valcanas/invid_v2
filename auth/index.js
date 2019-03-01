const LocalStrategy = require('passport-local').Strategy;
const connection = require('../config/dbconn');
const salt = require('../config/salt');
// to manage password
const crypto   = require('crypto');

const Q_LOGIN_USER = "select user_id, user_pass from user where user_name = ?";
const Q_FIND_USER = "select user_name from user where id = ?";

const conf = {
    usernameField: 'user_name',
    passwordField: 'user_pass',
    passReqToCallback: true //pass back entire req to call back
};

const handler = function (req, user_name, user_pass, done) {
    console.log(user_name+' = '+ user_pass);
    if(!user_name || !user_pass ) { return done(null, false, req.flash('message','All fields are required.')); }
    connection.query(Q_LOGIN_USER, [user_name], function(err, rows){
        console.log("error: "+ err);
        if (err) return done(req.flash('message',err));

        console.log("rows: "+ rows);
        if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
        let pwdsalt = salt+''+user_pass;
        var encPassword = crypto.createHash('sha1').update(pwdsalt).digest('hex');
        var dbPassword  = rows[0].user_pass;
        console.log("pass["+encPassword+"] dbPass ["+dbPassword+"]");
        if(!(dbPassword == encPassword)){
            return done(null, false, req.flash('message','Invalid username or password.'));
        }
        req.session.user = rows[0];
        return done(null, rows[0]); // null as first argument because there is no error
    });
};

const ls = new LocalStrategy(conf, handler);

/**
 * pass sufficient identifying information to recover the user account on any subsequent requests
 */
const serializeUser = function(user, done) {
    console.log(">> serializing user: " + JSON.stringify(user));
    done(null, user.id);
};

/**
 * pass the user profile based on the identifying information that was serialized to the session
 */
const deserializeUser = function(id, done) {
    console.log("<< deserializing user");
    connection.query(Q_FIND_USER, id, function (err, rows){
        console.log("user deserialized: " + JSON.stringify(rows[0]));
        done(err, rows[0]);
    });
};

module.exports = {
    localStrategy: ls,
    serializeUser,
    deserializeUser
}