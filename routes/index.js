var post=require("../model/post");
exports.index = function(req, res){
  res.render('index', { title: 'LinoBLog' })
};
