/**
 * New node file
 */
/*
 * GET users listing.
 */
var PurchaseOrderProvider = require('../dao/purchase_order_provider').PurchaseOrderProvider , fs = require('fs')	
	, readline = require('readline')   , XLSX = require("xlsx") , MyDateUtil=require("../util/date_util.js");

var purchaseOrderProvider = new PurchaseOrderProvider();


exports.statisticEnter=function(req, res) {
    purchaseOrderProvider.statisticEnterRecord(function(error , results){
           if(error) {
               res.send(error);
           } else {
               res.json(results);
           }
        }
    );
}

exports.queryUnpaied = function(req , res) {
    var page = req.body.page;
    var rp = req.body.rp;
    var sortname = req.body.sortname;
    var sortorder = req.body.sortorder;
    var buyer =req.body.buyer;
    var startDate = req.body.startPurchaseDate;
    var endDate = req.body.endPurchaseDate;
    console.log("page="+page+"-------rp"+rp);
    page = page == null?1:page;
    rp = rp==null?10:rp;
    var data = {};
    purchaseOrderProvider.pagedAccountPayable((page-1)*rp , rp ,sortname , buyer , startDate , endDate,
        function(error , purchaseOrders , totalCount){
        if(error) {
            res.send(500 , "查询sale order 出错");
        } else {
            console.log(purchaseOrders);
            data.total = totalCount;
            data.rows = purchaseOrders;
            data.page = page;
            res.json(data);
        }
    });
}

exports.queryPurchase=function(req , res) {
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	var buyer =req.body.buyer;
	var startDate = req.body.startPurchaseDate;
	var endDate = req.body.endPurchaseDate;
	console.log("page="+page+"-------rp"+rp);
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var data = {};
	purchaseOrderProvider.pagedPurchaseAll((page-1)*rp , rp ,sortname , buyer , startDate , endDate,
        function(error , purchaseOrders , totalCount){
		if(error) {
			res.send(500 , "查询sale order 出错");
		} else {
			console.log(purchaseOrders);
			data.total = totalCount;
			data.rows = purchaseOrders;
			data.page = page;
			res.json(data);
		}
	});
}



exports.findAllBuyer = function(req ,res) {
    purchaseOrderProvider.findAllBuyer(function(error , buyers) {
        if(error)
            res.send("error:");
        else
            res.json(buyers);
    });
}

exports.newPurchase = function(req , res) {
	var purchase_order={};
	purchase_order.purchaseDate = MyDateUtil.myDateFormat(req.body.purchaseDate);
	purchase_order.buyer = req.body.buyer;
	purchase_order.name = req.body.name;
	purchase_order.amount = req.body.amount;
	purchase_order.unitPrice = req.body.unitPrice;
	purchase_order.receiveTime =  MyDateUtil.myDateFormat(req.body.receiveTime);
	purchase_order.paymentType = req.body.paymentType;
	
	purchase_order.invoiceMoney = req.body.invoiceMoney;
	purchase_order.description = req.body.description;
	purchase_order.brand = req.body.brand;
	purchase_order.model = req.body.model;
	purchase_order.unit = req.body.unit;
	purchase_order.enterOrder = req.body.enterOrder;
	purchase_order.payTime = req.body.payTime;
	purchase_order.taxOrder = req.body.taxOrder;
	purchase_order.receiveInvoiceTime =  MyDateUtil.myDateFormat(req.body.receiveInvoiceTime);
	purchase_order.express = req.body.express;
	
	console.log(purchase_order);
	purchaseOrderProvider.save(purchase_order , function(error , purchase_order) {
		if(error) 
		 	res.send("error:"+error);
		else
		    res.send("success");
	});
}



exports.purchasefileUploader = function(req , res) {
	var path = req.files.thumbnail.path;
	var size = req.files.thumbnail.size;
  	var name = req.files.thumbnail.name;
  	console.log(name+"__path"+path);
  	var targetPath = "./uploadfs/"+name;
  	console.log("target_path:"+targetPath);
  	// 移动文件
    fs.rename(path,targetPath , function(err) {
      if (err) throw err;
      // 删除临时文件夹文件, 
      fs.unlink(path, function() {
         if (err) throw err;
        // res.send('File uploaded to: ' + path + ' - ' + req.files.thumbnail.size + ' bytes');
      });
      console.log("before read xlsx");
      var xlsx = XLSX.readFile(targetPath);
      var sheet_name_list = xlsx.SheetNames;
      console.log(sheet_name_list);
      var str = "";
      xlsx.SheetNames.forEach(function(y) {
      		if("采购"!=y) {
      			return false ;
      		}
      		console.log(y);
			var rows =  XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[y]);
			for(var i=0 , l=rows.length; i< l; ++i){
			    var arrayR = rows[i];
			    for(key in arrayR) {
				   	str += key+" : "+arrayR[key]+" ; ";
			    }
			    var purchase_order = purchaseOrderHandler(arrayR);
			    console.log(purchase_order);
			    purchaseOrderProvider.save(purchase_order , function(error , purchase_order) {
					if(error) 
					 	res.send("error:"+error);
					else
					    res.send("success");
				});
			}
	  });
	 res.send(str);
    });
}


function purchaseOrderHandler(arrayR) {
	var purchase_order={};
	purchase_order.purchaseDate =  MyDateUtil.myDateFormat(arrayR["日期"]);
	purchase_order.buyer = arrayR["进货单位"];
	purchase_order.brand = arrayR["品牌"];
	purchase_order.name = arrayR["品名"];
	purchase_order.model = arrayR["型号"];
	purchase_order.amount = arrayR["数量"];
	purchase_order.unit = arrayR["单位"];
	purchase_order.unitPrice = arrayR["单价"];
	purchase_order.totalMoney = arrayR["金额"];
	purchase_order.enterOrder = arrayR["入库单"];
	purchase_order.receiveTime =  MyDateUtil.myDateFormat(arrayR["收货时间"]);
	purchase_order.payTime =  MyDateUtil.myDateFormat(arrayR["付款时间"]);
	purchase_order.paymentType = arrayR["付款方式"];
	purchase_order.taxOrder = arrayR["税票号"];
	purchase_order.invoiceMoney = arrayR["发票金额"];
	purchase_order.receiveInvoiceTime =  MyDateUtil.myDateFormat(arrayR["收票时间"]);
	purchase_order.description = arrayR["备注"];
	purchase_order.express = arrayR["快递"];
	return purchase_order;

}

