var async=require('async'),
    Db=require('./db'),
    client=require('../conf').client;

var post=new Db('post');
module.exports=post;

post.getByMonth=function(month,callback){
  this.get(
    {
      where:{'month(pubdate)':month},
      order:'-id',
    },callback);
};

post.getById=function(id, callback){
  client.query('select * from'
  ,callback);
};

post.save=function(data, callback){
//  this.constructor.prototype.save(data, callback);  //LoL
  this.saveit(data, callback);  
}
