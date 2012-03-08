var crypto=require('crypto');
var md5=crypto.createHash('md5');

md5.update('loveandkiss');
var c = md5.digest('hex');
console.log(c);
