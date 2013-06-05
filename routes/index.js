/*
 * GET home page.
 */

exports.admin = function(req, res){
 		 res.render('admin.html', { title: 'Express' });
};

exports.page = function(req, res){
 		 res.render('page.html', { title: 'Express' });
};