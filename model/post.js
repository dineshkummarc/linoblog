var async=require('async'),
    Db=require('./db');

var post=new Db('post');
module.exports=post;

post.getByMonth=function(month,callback){
  this.get(
    {
      where:['month(pubdate)',month], 
      order:'-id',
    },callback);
};

post.getById=function(id, callback){
  this.get({
    where:{'id': id},
    limit:[0,1],
  },callback);
};
