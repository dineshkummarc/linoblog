var async=require('async');
var conf=require('../conf').conf;
var client=require('../conf').client;

var numperpage=conf.numperpage;
var adminnumperpage=conf.adminnumperpage;

function save(tablename, data, callback){
  if (typeof(data)!=='object'){   //TODO:FIXIT
    return '500';
  }
  var sql, args=[];
  if (data.id==null){         //new record
    sql='insert into `'+tablename+'` set ';
    for (k in data){
      sql+=k+'=?,';
      args.push(data[k]);
    }
    sql=sql.slice(0, -1);
  }else{                      //update record
    sql='update `'+tablename+'` set ';
    for (k in data){
      if(k==='id'){
        break;
      }
      sql+=k+'=?,';
      args.push(data[k]);
    }
    sql=sql.slice(0, -1);
    sql+=' where id=?';
    args.push(data.id);
  }
  console.log(sql+'   '+args);
  client.query(sql, args, callback);
}

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
        res.render('index', {
          posts:results,
          pgtotal:Math.ceil(results[0].total/numperpage),
          pgnum:pgnum,
        });
  });
};

exports.post=function(req, res){
  client.query('select post.*, category.name from `post`, `category` where month(post.pubdate)=? and year(post.pubdate)=? and post.title=? and post.category_id=category.id', [req.params.month, req.params.year, req.params.title],
      function(err, results){
        if(err){
          console.error(err);
        }
        res.render('post', {
          post:results[0]
        });
      });
};

exports.catepage=function(req, res){
  var pgnum=req.params.pagenum?req.params.pagenum:1;
  var start=(pgnum-1)*numperpage;
  client.query('select post.*, category.name, (select count(*) from post where name=?) as total from post, category where category_id=(select id from category where name=?) and category_id=category.id order by pubdate DESC limit ?,?', [req.params.name, req.params.name, start, numperpage],
      function(err, results){
        if(err){
          console.error(err);
        }
        res.render('catepage', {
          name: req.params.name,
        posts:results,
        pgtotal:Math.ceil(results[0].total/numperpage),
        pgnum:pgnum});
      });
};

exports.month=function(req, res){
  var pgnum=req.params.pagenum?req.params.pagenum:1;
  var start=(pgnum-1)*numperpage;
  client.query('select post.*, category.name, (select count(*) from post where month(pubdate)=? and year(pubdate)=?) as total from post, category where month(pubdate)=? and year(pubdate)=? order by pubdate DESC limit ?,?', [req.params.month, req.params.year,req.params.month, req.params.year, start, numperpage],
      function(err, results){
        if(err || results.length===0){
          console.error(err);
          return "404";
        }
        res.render('month', {
          month:req.params.month,
        year:req.params.year,
        posts:results,
        pgtotal:Math.ceil(results[0].total/numperpage),
        pgnum:pgnum});
      });
};

var admin={};
exports.admin=admin;

admin.admin=function(req, res){
  if(req.session.user!=null){
    res.redirect('/admin/page');
    return;
  }
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

admin.post=function(req, res){
  client.query('select post.*, category.name from `post`, `category` where post.category_id=category.id and post.id='+req.params.id,
      function(err, results){
        if(err){
          console.error(err);
        }
        client.query('select * from category', function(err, r){
          if(err){
            console.error(err);
          }
          console.log(results, r);
          res.render('admin/editpost', {
            post: results[0],
          categories: r,
          });
        });
      });
};

admin.editpost=function(req, res){
  console.log(req.body);
  save('post', req.body, function(err, results){
    if(err){
      console.error(err);
    }
    console.log(results);
    client.query('select title, pubdate from `post` where id=?', [results.insertId?results.insertId:req.body.id],
      function(err, r){
        if(err){
          console.error(err);
        }
        res.redirect('/'+r[0].pubdate.getFullYear()+'/'+(r[0].pubdate.getMonth()+1)+'/'+r[0].title);
      });
  });
};

admin.deletepost=function(req, res){
  client.query('delete from `post` where id=?', [req.body.id],
      function(err, r){
        if(err){
          console.error(err);
        }
        res.redirect('/admin/page');
        return;
      });
};

admin.batchdeletepost=function(req, res){
  if(req.body.deleteid==null){
    res.redirect('/admin/page');
    return;
  }
  var ids = req.body.deleteid.join(',');
  client.query('delete from `post` where id in ('+ids+')', 
        function(err, results){
          if(err){
            console.error(err);
          }
          res.redirect('/admin/page');
          return;
        });
      };

admin.newpost=function(req, res){
  res.render('admin/newpost',{});
};

admin.page=function(req, res){ 
  var pgnum=req.params.pagenum?+req.params.pagenum:1;
  var start=(pgnum-1)*adminnumperpage;
  client.query('select post.*, category.name, (select count(*) from post) as total  FROM `post`,`category` where post.category_id=category.id order by pubdate DESC limit ?,?', [start,adminnumperpage], 
      function(err, results){
        if(err){
          console.error(err);
        }
        res.render('admin/index', {
          posts:results,
          pgtotal:Math.ceil(results[0].total/adminnumperpage),
          pgnum:pgnum});
      });
};

admin.catepage= function(req, res){
  var pgnum=req.params.pagenum?+req.params.pagenum:1;
  var start=(pgnum-1)*adminnumperpage;
  client.query('select *, (select count(*) from `category`) as total from `category` order by id',
      function(err, results){
        if(err){
          console.error(err);
        }
        res.render('admin/category', {
          categories:results,
          pgtotal:Math.ceil(results[0].total/adminnumperpage),
          pgnum:pgnum});
  });
};

admin.category=function(req, res){
  client.query('select * from `category` where id=?', [req.params.id],
      function(err, results){
        if(err){
          console.error(err);
        }
        res.render('admin/editcate', {
          category: results[0],
        });
      });
};

admin.editcate=function(req, res){
  console.log(req.body);
  save('category', req.body, function(err, results){
    if(err){
      console.error(err);
    }
    console.log(results);
    res.redirect('/admin/category');
  });
};

admin.newcate=function(req, res){
  res.render('admin/newcate',{});
};

admin.deletecate=function(req, res){
  if(req.body.id==1){
    res.redirect('back');
    return;
  }
  client.query('update `post` set category_id=1 where category_id=?', [req.body.id],
      function(err, results){
        if(err){
          console.error(err);
        }
        client.query('delete from `category` where id=?', [req.body.id],
          function(err, r){
            if(err){
              console.error(err);
            }
            res.redirect('/admin/category');
            return;
          });
      });
};
