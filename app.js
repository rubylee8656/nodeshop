require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const db = require(__dirname + '/modules/db_connect2');
const upload = require(__dirname + '/modules/upload-img');
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.set('view engine', 'ejs');
//top-level middleware
// const corsOptions = {
//     credentials: true,
//     origin: function (origin, callback) {
//         // console.log({origin});
//         callback(null, true);
//     }
// };
app.use(cors());

app.use((req, res, next) => {
  //自己定義的template helper function
  res.locals.toDateString = (d) => moment(d).format('YYYY-MM-DD');
  res.locals.toDatetimeString = (d) => moment(d).format('YYYY-MM-DD HH:mm:ss');
  res.locals.title = '今天要來點乖乖嗎';
  res.locals.session = req.session;
  next();
})

app.get('/', (req, res) => {
  // res.send(`<h2>Hello!</h2>`);
  res.render('main', { name: 'miee' });
})

app.get('/try-db', async (req, res) => {
  const [rows] = await db.query("SELECT * FROM shop_list LIMIT 5");
  res.json(rows);
});

app.use('/shop-api', require(__dirname + '/routes/index'));


app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.use((req, res) => {
  // res.type('text/plain');
  res.status(404).render('404');
})

const port = process.env.SERVER_PORT || 3003;
app.listen(port, () => {
    console.log(`server started,port:${port}`);
});

module.exports = app;
