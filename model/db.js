var client=require('../conf').client,
    _=require('underscore');

var Db = module.exports=function Db(tablename){
  this.tablename=tablename;
  this.results=[];
};
Db.client=client;

//
//TODO:SQLInjection prevent and enhencement
Db.prototype.get=function(options, callback){
  var opts={
    fields:'',
    where:null,
    order:'',
    limit:[]
  }

  _.extend(opts, options);

  var sql="select",
      args=[];
  if (opts['fields']==''){
    sql+=' *';
  }else{
    sql+=' '+opts['fields'];
  }

  sql+=' from `'+this.tablename+'`';

  var where=opts['where'];
  /*if (opts['where'].length==2){
    sql+=' where '+opts['where'][0]+'=?';
    args.push(opts['where'][1]);
  }*/
  if(typeof(where)==='object' && where!=null){//TODO: FIXIT
    sql+=' where ';
    for (k in where){
      sql+=k+'=?';
      args.push(where[k]);
    }
  }

  var o='ASC',
      order=opts['order'];
  if (order!=''){
    if (order.indexOf('-')==0){
      o='DESC';
      order=order.slice(1);
    }
    sql += ' order by '+order+' '+o;
  }

  var limit=opts['limit'];
  if (limit.length!=0){
    sql+=' limit ?';
    args.push(limit[0]);
    if (limit.length==2){
      sql+=', ?';
      args.push(limit[1]);
    }
  }

  console.log(sql+'   '+args);
  client.query(sql, args, callback);
};
