const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const bodyParser = require('body-parser')
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');
const flash = require('express-flash');
const session = require('express-session');
const auth = require('./middleware/auth');

// Routers
const indexRouter = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const populateRouter = require('./routes/populate')
const teamsRouter = require('./routes/teams');
const playersRouter = require('./routes/players');
const authRoutes = require('./routes/authRoutes');
const userTeamRouter = require('./routes/userTeam');
const menuRoutes = require('./routes/menuRoutes');
const rulesRoutes = require('./routes/rulesRoutes');

// Initialize database
var db = require('./models');

// Först, skapa alla tabeller
db.sequelize.sync({ 
    alter: true,
    logging: console.log 
}).then(() => {
    console.log("Database tables updated");
}).catch(err => {
    console.error("Error updating database:", err);
});
var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/css')); // Adding mapping for bootstrap
app.use(express.static(__dirname + '/node_modules/bootstrap/dist/js')); // js
app.use(express.static(__dirname + '/node_modules/jquery/dist')); // jquery
app.use(express.static(__dirname + '/node_modules/popper.js/dist/umd')); // popper
// reg.flash function 
app.use(session({
  secret: 'sest21A',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false}
}));

app.use(flash());



app.use(cookieParser());

// Protected routes - lägg dessa FÖRE route definitions
app.use('/teams', auth);
app.use('/players', auth);

// Routes
app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/init', populateRouter);
app.use('/teams', teamsRouter);
app.use('/players', playersRouter);
app.use('/myteam', userTeamRouter);
app.use('/menu', menuRoutes);
app.use('/rules', rulesRoutes);

// Swagger /doc
app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
