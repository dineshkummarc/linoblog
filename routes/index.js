var async=require('async');
var conf=require('../conf').conf;
var post=require("../model/post");

var numperpage=conf.numperpage;

exports.index = function(req, res){
  exports.page(req, res);
};

exports.page= function(req, res){
  var pgnum=req.params.pagenum?req.params.pagenum:1
  var start=(pgnum-1)*numperpage;
  async.parallel({
    posts:function(cb){
            post.get({order:'-id', limit:[start, numperpage]}, function(err, results){
              if(err){
                console.error(err);
              }
              cb(null, results);
            })
          },
    total:function(cb){
            post.get({fields:'count(*)'}, function(err, results){
              if(err){
                console.error(err);
              }
              cb(null, results[0]);
            })
          },
  },
  function(err, results){
    if(err){
      console.error(err);
    }
    res.render('index', {
      title: 'LinoBLog',
      posts:results.posts, 
      pgtotal:Math.ceil(results.total['count(*)']/numperpage),
      pgnum:pgnum});
  });
};

exports.post=function(req, res){
  post.getById(req.params.id, function(err, results){
    if(err){
      console.error(err);
    }
    res.render('post', {
      post: results[0],
    });
  });
}

var admin={}
exports.admin=admin;

admin.post=function(req, res){
  post.getById(req.params.id, function(err, results){
    if(err){
      console.error(err);
    }
    res.render('editpost', {
      post: results[0],
    });
  });
}

admin.editpost=function(req, res){
  console.log(req.body);
  post.save(req.body, function(err, results){
    res.redirect('/post/'+(results.insertId?results.insertId:req.params.id));
  });
}

admin.newpost=function(req, res){
  res.render('newpost',{});
}
