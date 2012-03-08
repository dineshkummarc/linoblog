var async=require('async');
var conf=require('../conf').conf;
var post=require("../model/post");
var category=require("../model/category");
var client=require('../conf').client;

var numperpage=conf.numperpage;

exports.index = function(req, res){
  exports.page(req, res);
};

exports.page= function(req, res){
  var pgnum=req.params.pagenum?+req.params.pagenum:1;
  var start=(pgnum-1)*numperpage;
  client.query('select post.*, category.name, (select count(*) from post) as total  FROM `post`,`category` where post.category_id=category.id order by pubdate DESC limit '+start+','+numperpage, 
      function(err, results){
        if(err){
          console.error(err);
        }
        console.log(results);
        res.render('index', {
          title: 'LinoBLog',
          posts:results,
          pgtotal:Math.ceil(results[0].total/numperpage),
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
};

var admin={}
exports.admin=admin;

admin.post=function(req, res){
  post.getById(req.params.id, function(err, results){
    if(err){
      console.error(err);
    }
    res.render('admin/editpost', {
      post: results[0],
    });
  });
};

admin.editpost=function(req, res){
  console.log(req.body);
  post.save(req.body, function(err, results){
    res.redirect('/post/'+(results.insertId?results.insertId:req.params.id));
  });
};

admin.newpost=function(req, res){
  res.render('admin/newpost',{});
};

admin.admin=function(req, res){
  res.render('admin/admin', {});
};

admin.login=function(req, res){
  var sql='select `passwd` from `user` where name=?';
  client.query(sql, [req.body.name], function(err, results){
    if(err){
      console.error(err);
    }
    var crypto=require('crypto');
    var md5=crypto.createHash('md5');
    md5.update(req.body.passwd);
    var c = md5.digest('hex');
    if(results[0]!=null && c === results[0].passwd){
      req.session.user=req.body.name;
      res.redirect('/admin/page');
    }else{
      res.redirect('/admin');
    }
  });
};

admin.logout=function(req, res){
  delete(req.session.user);
  res.redirect('/admin');
};

admin.page=function(req, res){
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
    res.render('admin/index', {
      title: 'LinoBLog',
    posts:results.posts, 
    pgtotal:Math.ceil(results.total['count(*)']/numperpage),
    pgnum:pgnum});
  });
};

exports.catepage=function(req, res){
  var pgnum=req.params.pagenum?req.params.pagenum:1;
  var start=(pgnum-1)*numperpage;
  var cateid;
  async.series({
    category_id: function(cb){
      category.get({where:{name:req.params.name}}, function(err, results){
        if(err){
          console.error(err);
        }
        console.log(results);
        cateid=results[0].id;
        cb(null,results);
      })
    },
    categories:function(cb){
      post.get({order:'-id', limit:[start, numperpage], where:{category_id:cateid}}, function(err, results){
        if(err){
          console.error(err);
        }
        cb(null, results);
      })
    },
    total:function(cb){
      post.get({fields:'count(*)', where:{category_id:cateid}}, function(err, results){
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
      res.render('catepage', {
        title: 'LinoBLog',
      name: req.params.name,
      categories:results.categories, 
      pgtotal:Math.ceil(results.total['count(*)']/numperpage),
      pgnum:pgnum});
    });
};

exports.month=function(req, res){
  var pgnum=req.params.pagenum?req.params.pagenum:1;
  var start=(pgnum-1)*numperpage;
  async.parallel({
    posts:function(cb){
      post.get({where:{'month(pubdate)':req.params.month,'year(pubdate)':req.params.year},
        order:'-id', limit:[start, numperpage]}, function(err, results){
        if(err){
          console.error(err);
        }
        cb(null, results);
      });
    },
    total:function(cb){
      post.get({where:{'month(pubdate)':req.params.month,'year(pubdate)':req.params.year},
        fields:'count(*)'}, function(err, results){
        if(err){
          console.error(err);
        }
        cb(null, results[0]);
      });
    },
  },
  function(err, results){
    if(err){
      console.error(err);
    }
    res.render('month', {
      title: 'LinoBLog',
    month:req.params.month,
    year:req.params.year,
    posts:results.posts, 
    pgtotal:Math.ceil(results.total['count(*)']/numperpage),
    pgnum:pgnum});
  });
};
