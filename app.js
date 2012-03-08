
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

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

app.dynamicHelpers({some:function(req, res){
    return "YES";
}
});

app.helpers({
  baseurl:"http://localhost:3000/",
});
// Routes
app.get('/', routes.index);
app.get('/page/:pagenum?', routes.page);
app.get('/post/:id', routes.post);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
