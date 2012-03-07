var client=require('../conf');
var Db = module.exports=function Db(tablename){
    this.tablename=tablename;
    this.results=[];
};

var util={};
util.merge=function(toarray, witharray){
    for (k in witharray){
        toarray[k]=witharray[k];
    }
}

Db.prototype.getBy=function(field, value, orderby, limit, callback){
    var order='ASC';
    var args=[];
    var sql='select * from `'+this.tablename+'`';
    if (field!=null){
        sql+=' where '+field+'='+value;
    }
    if (orderby!=null){
        if (orderby.indexOf('-')==0){
            order='DESC';
            orderby=orderby.slice(1);
        }
        sql += ' order by '+ orderby+' '+order;
        args.push(orderby);
    }
    if (limit!=null){
        sql+=' limit '+limit[0]+','+limit[1];
    }
    console.log(sql+'   '+args);
    client.query(sql, callback);
};
