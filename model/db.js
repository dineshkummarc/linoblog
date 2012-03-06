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

var mysql=require('mysql');
var DATABASE_NAME='linoblog';
var USERNAME='root';
var PASSWORD='123';

var client=mysql.createClient({
    user:USERNAME,
    password:PASSWORD
});
client.query('use '+DATABASE_NAME);

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
    client.query(sql, function selectCb(err, results, fields){
        if (err){
            console.log(err);
        }
        client.end();
        console.log(results);
        this.result=results;
        callback(null, 1);
    });
};
