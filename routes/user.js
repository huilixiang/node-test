
/*
 * GET users listing.
 */
var UserProvider = require('../dao/user_provider').UserProvider;
var cryptoUtil = require('../util/CryptoUtil');
var userProvider = new UserProvider();

exports.index = function(req, res){
    var rememberme = req.cookies.remember;
    var username = req.cookies.username;
    var token = req.cookies.token;
    if(rememberme != '1') {
        res.render('login' , {error : ''});
    }
    userProvider.findByUsername(username , function(error , user){
        if(error) {
            res.render('login' , {'error':'登陆过程出现异常 ， 请联系系统管理员'});
        } else {
            if(user == null) {
                res.render("login" , {error : '用户名不存在'});
            }  else {
                if(cryptoUtil.md5(username+cryptoUtil.salt+user.role) != token) {
                    res.render("login" , {error : '密码错误'});
                }  else {
                    req.session.username = username;
                    req.session.password = user.password;
                    res.render("index" , {role:user.role});
                }
            }
        }
} )
};


exports.logout = function(req ,res) {
    req.session.username = null;
    req.session.password = null;
    var option =    { maxAge: -1, httpOnly: true };
    res.cookie("remember" , "0" ,option);
    res.cookie("username" , null , option);
    res.cookie("token" , null , option);
    res.render('login' , {error:''});
}


exports.signin = function(req , res) {
    var username = req.body.username;
    var password = req.body.password;
    var rememberme = req.body.rememberme;

    userProvider.findByUsername(username , function(error , user){
         if(error) {
             res.render('login' , {'error':'登陆过程出现异常 ， 请联系系统管理员'});
         } else {
             if(user == null) {
                 res.render("login" , {error : '用户名不存在'});
             }  else {
                 var ePwd = user.password;
                 if(password == null || ePwd != password) {
                     res.render("login" , {error : '密码错误'});
                 } else {
                     var role = user.role;
                     if(rememberme == "true")  {
                         var option =    { maxAge: 5*24*3600*1000, httpOnly: true };
                         res.cookie("remember" , "1" ,option);
                         res.cookie("username" , username , option);
                         res.cookie("token" , cryptoUtil.md5(username+cryptoUtil.salt+role) , option);
                     }

                     req.session.username = username;
                     req.session.password = password;
                     res.render("index" , {role : user.role});
                 }
             }
         }
    })  ;
}


exports.newEmployee = function(req , res) {
    var username = req.body.username;
    var password = req.body.password;
    var telephone = req.body.telephone;
    var address = req.body.address;
    var mobilephone = req.body.mobilephone;
    var role = req.body.role;
    var email = req.body.email;

    var company = req.body.company;
    if(company == null || company == "") {
        company = "重庆蒙吉安防";
    }

    var user = {};
    user.username = username;
    user.password = password;
    user.telephone = telephone;
    user.address = address;
    user.mobilephone = mobilephone;
    user.role = role;
    user.email = email
    user.company = company;

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



