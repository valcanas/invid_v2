const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorController = require('./controllers/error');

const dbConn = require('./config/mongodb');
dbConn();

//////////////////////////////

//const chatroomRouter = require('./routes/internal/chat-room');
const adminRoutes = require('./routes/admin');
/////////////////////////////

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(adminRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

app.listen(3000);

module.exports = app;