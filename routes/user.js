
/*
 * GET users listing.
 */
var UserProvider = require('../dao/user_provider').UserProvider;

var userProvider = new UserProvider();



exports.newEmployee = function(req , res) {
	var user={};
	user.username = req.body.username;
	user.telephone = req.body.telephone;
	user.address = req.body.address;
	user.mobilephone = req.body.mobilephone;
	user.email = req.body.email;
	user.company = req.body.company;
	console.log(user);
	userProvider.save(user , function(error , user) {
		if(error) 
		 	res.send("error:"+error);
		else
		    res.send("success");
	});
}

exports.queryAll = function(req , res) {
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var startIndex = (page-1) * rp;
	
	userProvider.pagedAll(startIndex , rp , sortname ,  function(error , users , totalCount){
		var data = {};
		if(error) {
			data.status = 'error';
		} else {
			data.total = totalCount;
			data.rows = users;
			console.log(users);
			data.page = page;
			res.json(data);
		}
	});
	

}



