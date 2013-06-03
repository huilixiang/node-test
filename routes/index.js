
/*
 * GET home page.
 */

exports.index = function(req, res){
 		 res.render('index.html', { title: 'Express' });
};

exports.admin = function(req, res){
 		 res.render('admin.html', { title: 'Express' });
};

exports.page = function(req, res){
 		 res.render('page.html', { title: 'Express' });
};