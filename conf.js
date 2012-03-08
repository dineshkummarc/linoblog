var mysql=require('mysql');

var dbconf={
    DATABASE_NAME:'linoblog',
    USERNAME:'root',
    PASSWORD:'123',
}
var client=mysql.createClient({
    user:dbconf['USERNAME'],
    password:dbconf['PASSWORD']
});
client.query('use '+dbconf['DATABASE_NAME'], function(err){if(err)console.error(err);});

var conf={
  blogname:"MY BLOG",
  numperpage:5,
};

module.exports.client=client;
module.exports.conf=conf;
