var async=require('async'),
    Db=require('./db');

var category=new Db('category');
module.exports=category;

category.getById=function(id, callback){
  this.get({
    where:{'id': id},
    limit:[0,1],
  },callback);
};

category.save=function(data, callback){
  this.saveit(data, callback);  
}
