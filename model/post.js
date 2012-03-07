var async=require('async');
var Db=require('./db');
var db=new Db('post');
var Post = module.exports=function Post(table){
    this.table=table;    
};

var util={};
util.merge=function(toarray, witharray){
    for (k in witharray){
        toarray[k]=witharray[k];
    }
}

Post.test2=function(){
    var rs;
    function callback(err, results, fields){
        if (err){
            console.log(err);
        }
        rs=results;
        console.log(rs);
    }
    db.getBy('id',1,null,null,callback);
}

Post.test = function(){
    db.query('insert into `post` set title=?, content=?, pubdate=curdate()',
            ['test', 'long long ago...']);
    db.query('select * from `post`',
            function selectCb(err, results, fields){
                if (err){
                    console.log(err);
                }
                console.log(results);
                db.end();
            }
    );
}
