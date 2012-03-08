var async=require('async'),
    db=require('../conf');

var tname='post';
//var db=new Db('post');
var post={};
module.exports=post;

post.getAll=function(callback){
  db.query('select * from `'+tname+'`', callback);
}
