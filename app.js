
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
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat" }));
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
  adminurl:"http://localhost:3000/admin/",
});

function auth(req, res, next){
  if (req.session.user!=null){
    next();
  }else{
    res.redirect('/admin');
  }
}

// Routes
app.get('/', routes.index);
app.get('/page/:pagenum?', routes.page);
app.get('/:year([0-9]+)/:month([0-9]+)/:pagenum([0-9]+)?', routes.month);
app.get('/:year([0-9]+)/:month([0-9]+)/:title', routes.post);
app.get('/category/:name/:pagenum([0-9]+)?', routes.catepage);

app.post('/login', routes.admin.login);
app.get('/logout', routes.admin.logout);
app.get('/admin', routes.admin.admin);

app.get('/admin/page/:pagenum([0-9]+)?', auth, routes.admin.page);
app.get('/admin/post/new', auth, routes.admin.newpost);
app.get('/admin/post/edit/:id([0-9]+)', auth, routes.admin.post);
app.post('/admin/post/edit/:id([0-9]+)?', auth, routes.admin.editpost);

//app.get('/admin/category/:pagenum([0-9]+)?', auth, routes.admin.catepage);
app.get('/admin/category', auth, routes.admin.catepage);
app.get('/admin/category/new', auth, routes.admin.newcate);
app.get('/admin/category/edit/:id([0-9]+)', auth, routes.admin.category);
app.post('/admin/category/edit/:id([0-9]+)?', auth, routes.admin.editcate);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
