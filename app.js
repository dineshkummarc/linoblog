
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mysql=require('mysql')
  , conf = require('./conf');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options',{
      layout:false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Setup Mysql Connection
app.client=mysql.createClient({
    user:conf['USERNAME'],
    password:conf['PASSWORD']
});
app.client.query('use '+conf['DATABASE_NAME']);

// Routes
app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
