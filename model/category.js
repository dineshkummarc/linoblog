var async=require('async'),
    Db=require('./db');

var category=new Db('category');
module.exports=post;

category.getById=function(id, callback){
  this.get({
    where:{'id': id},
    limit:[0,1],
  },callback);
};

post.save=function(data, callback){
//  this.constructor.prototype.save(data, callback);  //LoL
  this.saveit(data, callback);  
}
