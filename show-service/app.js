const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const {
  Phase
} = require('./models');

const { SHOW_DOMAIN_NAME } = require('./secrets/promenade-config.json');

const { createToken, validateToken } = require('./util/auth');

const startWebsockets = require('./ws');
const { startup } = require('./util/operations');
const { syncWithEventbrite } = require('./util/eventbrite');

const routes = require('./routes/index');
const users = require('./routes/user');
const shows = require('./routes/show');
const parties = require('./routes/party');
const phases = require('./routes/phase');
const navigation = require('./routes/navigation');
const sync = require('./routes/sync');

const app = express();

app.use(cors({ origin: true, credentials: true }));

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
  if(req.path === '/users/login' || req.path === '/users/magiclink' || req.method === 'OPTIONS') {
    next();
  } else {
    try {
      console.log('AUTH', JSON.stringify(req.cookies, null, 4));
      let token = req.cookies['promenade-auth-token'];
      let { userId, kind } = validateToken(token);
      req.userId = userId;
      req.userKind = kind;
      // console.log('AUTHED:', req.userId, req.userKind);
      next();
    } catch(e) {
      console.error('Auth error', e);
      if(req.path === '/users/reportError'){
        next();
      } else {
        res.sendStatus(403);
      }
    }
  }
});

app.use('/', routes);
app.use('/users', users);
app.use('/shows', shows);
app.use('/parties', parties);
app.use('/phases', phases);
app.use('/navigation', navigation);
app.use('/sync', sync);

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});

async function createServer() {
  const nms = require('./util/stream')(app);
  nms.run();

  if(app.locals.ENV_DEVELOPMENT){
    console.log('DEVELOPMENT');
    return http.createServer(app);
  } else {
    let [key, cert, ca] = await Promise.all([
      fs.readFile(`/etc/letsencrypt/live/services.${SHOW_DOMAIN_NAME}/privkey.pem`, `utf-8`),
      fs.readFile(`/etc/letsencrypt/live/services.${SHOW_DOMAIN_NAME}/cert.pem`, `utf-8`),
      fs.readFile(`/etc/letsencrypt/live/services.${SHOW_DOMAIN_NAME}/chain.pem`, `utf-8`)
    ]);
    let server = https.createServer({
      key,
      cert,
      ca
    }, app);
    return server;
  }
}

(async () => {
  try {
    await startup();
    const server = await createServer();
    startWebsockets(server);
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Listening on port ${process.env.PORT || 5000}`);
    });
  } catch (e){
    console.error('OHNO', e);
  }
})()


const { Admin } = require('./models');
async function defaultAdmin() {
  let admins = await Admin.find({}).lean();
  admins.map(admin => {
    admin.TOKEN = createToken(admin);
  })
  console.log('ADMINS', admins);
  if(!admins.length) {
    let newAdmin = await Admin.create({
      email: 'chris.uehlinger@gmail.com',
      username: 'chris',
      isRootUser: true,
      isOnline: false
    });
    let token = createToken(newAdmin);
    console.log('NEW ADMIN TOKEN', token);
  }
}

defaultAdmin();

module.exports = app;
