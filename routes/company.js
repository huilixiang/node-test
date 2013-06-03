var CompanyProvider = require('../dao/company_provider').CompanyProvider ,  fs = require('fs')	,XLSX = require("xlsx") ;
var companyProvider = new CompanyProvider();
exports.newCompany = function(req, res) {
	var company = {};
	company.name = req.body.companyName;
	company.bank = req.body.bank;
	company.address = req.body.address;
	company.comTelephone = req.body.comTelephone;
	company.fax = req.body.fax;
	company.postcode = req.body.code;
	company.mobilePhone = req.body.mobilePhone;
	company.bankAccount = req.body.bankAccount;
	company.tax = req.body.tax;
	company.linkman = req.body.linkman;
	company.telephone = req.body.telephone;
	company.other = req.body.other;
	company.description = req.body.description;
	company.businessType = req.body.businessType;
	console.log(company);	
	companyProvider.save(company , function(error , company) {
		if(error) {
			res.send("error:"+error);
		} else {
			res.send("success");
		}
	});
};

exports.pagedQuery = function(req , res) {
	var result = {};
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	var name = req.body.name;
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var startIndex = (page-1) * rp;
	
	companyProvider.pagedAll(startIndex , rp , sortname ,  name , function(error , companys , totalCount){
		if(error) {
			result.status = 'error';
			res.send(result);
		} else {
			result.status = 'success';
			result.rows = companys;
			result.total = totalCount;
			result.page = page;
			res.json(result);
		}
	});
}


exports.queryAll = function(req , res) {
	var result = {};
	companyProvider.findAll(function(error , companys){
		if(error) {
			result.status = 'error';
			res.send(result);
		} else {
			result.status = 'success';
			result.rows = companys;
			res.json(result);
		}
	});
}



exports.fileUploader = function(req , res) {
	var path = req.files.thumbnail.path;
	var size = req.files.thumbnail.size;
  	var name = req.files.thumbnail.name;
  	
  	console.log(name+"__path"+path);
  	var targetPath = "./uploadfs/"+name;
  	// 移动文件
    fs.rename(path,targetPath , function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(path, function() {
         if (err) throw err;
        // res.send('File uploaded to: ' + path + ' - ' + req.files.thumbnail.size + ' bytes');
      });
      var xlsx = XLSX.readFile(targetPath);
      var sheet_name_list = xlsx.SheetNames;
	  var cmpArray = new Array();
      xlsx.SheetNames.forEach(function(y) {
      		var isBussiness = ("商家"==y);
			var isChannelCustomer = ("渠道客户"==y);
			var isEndCustomer = ("终端客户"==y);
			var isTerminal = ("终端"==y);
			var isLogistics = ("物流、快递合作单位"==y);
			var rows =  XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[y]);
			for(var i=0 , l=rows.length; i< l; ++i){
			    var arrayR = rows[i];
			    var cmp ;
			    if(isBussiness) {
			    	cmp = shangJiaHandler(arrayR);
			    } else if(isChannelCustomer) {
			    	cmp = quDaoKeHuHandler(arrayR);
			    } else if(isEndCustomer) {
			    	cmp = zhongDuanKeHuHandler(arrayR);
			    } else if(isTerminal) {
			    	cmp = zhongDuanHandler(arrayR);
			    } else if(isLogistics) {
			    	cmp = wuLiuHeZuoHandler(arrayR);
			    }
			   
			   cmpArray[cmpArray.length] = cmp;
			   console.log(cmp);
			}
	  });
	  
	    companyProvider.save(cmpArray , function(error , cmp) {
			if(error) {
				console.error(error);
			} else {
			   res.send(cmp);
			}
		});
    });
}

function shangJiaHandler(array) {
	  	var company = {};
		company.name = array["公司名称"];
		company.bank = array["开户银行"];
		company.address = array["地址电话"];
		company.tax = array["税号"];
		company.mobilePhone = array["联系电话（手机）"];
		company.telephone = array["联系电话（座机）"];
		company.comTelephone = "";
		company.fax = array["传真"];
		company.postcode = array["邮编"];
		company.bankAccount = array["帐号"];
		company.linkman = array["联系人"];
		company.other = array["血液"];
		company.description = array["12"];
		company.businessType = "商家";
		company.consignee = "";
		company.email = "";
		return company;

}

//渠道客户
function quDaoKeHuHandler(array){
	  	var company = {};
		company.name = array["公司名称"];
		company.bank = array["开户银行"];
		company.address = array["公司地址及电话"];
		company.comTelephone = "";
		company.fax = array["传真"];
		company.tax = array["税号"];
		company.linkman = array["联系人"];
		company.telephone = array["联系电话（座机）"];
		company.mobilePhone = array["联系电话（手机）"];
		company.consignee = array["收货地址、收货人"];
		company.postcode = "";
		company.bankAccount = array["帐号"];
		company.other = "";
		company.description = "";
		company.businessType = "渠道客户";
		company.email = array["邮箱"];
		return company;
}

//终端客户
function zhongDuanKeHuHandler(array){
	  	var company = {};
		company.name = array["公司名称"];
		company.tax = array["税号"];
		company.address = array["公司地址及电话"];
		company.bank = array["开户银行"];
		company.bankAccount = array["帐号"];
		company.linkman = array["联系人"];
		company.telephone = array["联系电话（座机）"];
		company.mobilePhone = array["联系电话（手机）"];
		company.fax = array["传真"];
		company.consignee = array["收货地址、收货人"];
		company.email = array["邮箱"];
		company.postcode = "";
		company.other = "";
		company.comTelephone = "";
		company.description = "";
		company.businessType = "终端客户";
		return company;
}
//终端
function zhongDuanHandler(array) {
	  	var company = {};
		company.name = array["单位名称"];
		company.bank = "";
		company.address = array["地址"];
		company.comTelephone = "";
		company.fax = "";
		company.postcode = "";
		company.mobilePhone = array["电话"];
		company.bankAccount = "";
		company.tax = "";
		company.linkman = array["姓名"];
		company.telephone = "";
		company.other = array["备注"];
		company.description = "";
		company.businessType = "终端";
		company.consignee = "";
		company.email = "";
		return company;

}

//物流合作
function wuLiuHeZuoHandler(array) {
	  	var company = {};
		company.name = array["单位"];
		company.bank = "";
		company.address = "";
		company.comTelephone = "";
		company.fax = array["传真"];
		company.postcode = "";
		company.mobilePhone = array["联系电话（手机）"];
		company.bankAccount = "";
		company.tax = "";
		company.linkman = array["联系人"];
		company.telephone = array["联系电话（座机）"];
		company.other = array["其它"];
		company.description = "";
		company.businessType = array["类型"];
		company.consignee = "";
		company.email = "";
		return company;

}