var post=require("../model/post");
exports.index = function(req, res){
  post.getAll(function(err, results){
    res.render('index', { title: 'LinoBLog' ,posts:results});
  });
};
