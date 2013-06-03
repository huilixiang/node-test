/**
 * New node file
 */
/*
 * GET users listing.
 */
var SellOrderProvider = require('../dao/sell_order_provider').SellOrderProvider, 
        fs = require('fs')	, readline = require('readline') , XLSX = require("xlsx") , MyDateUtil=require("../util/date_util.js");

var sellOrderProvider = new SellOrderProvider();

var colMapArray = {"发货日期":"shipmentDate" , "出货单位":"shipmentCmp", "品牌":"brand", 
			"品名":"name", "型号":"model", "数量":"amount", "单位":"unit", "单价":"unitPrice",
   			"金额":"totalMoney", "":"", "成本":"actualCost", "收款时间":"receiveMoneyTime", 
   			"收款方式":"receiveMoneyType", "付款金额":"payAmount", "未付金额":"unpayAmount",
   			"出库单号":"shipmentOrder", "出货方式":"shipmentType", "收货人":"receiver", 
   			"收货人电话":"receiverPhone","收货地址":"receiverAddress" , "运单号":"transpotOrder", "税票号":"taxOrder" ,
   			"税票金额":"taxAmount" , "出票时间":"makeInvoiceTime" , "发票快递单号":"invoiceExpressOrder" , 
   			"来源":"source" , "备注":"description" , "类别":"category" , "销售员":"salesman" };

exports.query = function(req , res) {
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	var shipmentCmp = req.body.shipmentCmp;
	var startDate = req.body.startShipmentDate;
	var endDate = req.body.endShipmentDate;
	console.log("page="+page+"-------rp="+rp+"----shipmentCmp="+shipmentCmp+"-----startDate="+startDate+"------endDate="+endDate+"-----------sortname"+sortname);
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var data = {};
	sellOrderProvider.pagedSaleAll((page-1)*rp , rp , shipmentCmp , MyDateUtil.parseDate(startDate) , MyDateUtil.parseDate(endDate)  ,sortname ,  function(error , sellOrders , totalCount){
		if(error) {
			res.send(500 , "查询sale order 出错");
		} else {
			console.log(sellOrders);
			data.total = totalCount;
			data.rows = sellOrders;
			data.page = page;
			res.json(data);
		}
	});
}

exports.queryUnreceived = function(req , res) {
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	var shipmentCmp = req.body.shipmentCmp;
	var startDate = req.body.startShipmentDate;
	var endDate = req.body.endShipmentDate;

	page = page == null?1:page;
	rp = rp==null?10:rp;
	var data = {};
	sellOrderProvider.pagedAccountReceivableAll((page-1)*rp , rp , shipmentCmp , MyDateUtil.myDateFormat(startDate) ,
         MyDateUtil.myDateFormat(endDate)  ,sortname ,  function(error , sellOrders , totalCount){
		if(error) {
			res.send(500 , "查询sale order 出错");
		} else {
			console.log(sellOrders);
			data.total = totalCount;
			data.rows = sellOrders;
			data.page = page;
			res.json(data);
		}
	});
}

exports.newSell = function(req , res) {
	console.log("CONTENT TYPE=",req.get('content-type'));
	var sell_order={};
	sell_order.shipmentDate = MyDateUtil.myDateFormat(req.body.shipmentDate);
	sell_order.shipmentCmp = req.body.shipmentCmp;
	sell_order.brand = req.body.brand;
	sell_order.name = req.body.name;
	sell_order.model = req.body.model;
	sell_order.amount = req.body.amount;
	sell_order.unit = req.body.unit;
	sell_order.unitPrice = req.body.unitPrice;
	sell_order.totalMoney = req.body.totalMoney;
	sell_order.actualCost = req.body.actualCost;
	sell_order.receiveMoneyTime = MyDateUtil.myDateFormat(req.body.receiveMoneyTime);
	sell_order.receiveMoneyType = req.body.receiveMoneyType;
	sell_order.payAmount = req.body.payAmount;
	sell_order.unpayAmount = req.body.unpayAmount;
	sell_order.shipmentOrder = req.body.shipmentOrder;
	sell_order.shipmentType = req.body.shipmentType;
	sell_order.receiver = req.body.receiver;
	sell_order.receiverPhone = req.body.receiverPhone;
	sell_order.receiveAddress = req.body.receiveAddress;
	sell_order.transpotOrder = req.body.transpotOrder;
	sell_order.taxOrder = req.body.taxOrder;
	sell_order.taxAmount = req.body.taxAmount;
	sell_order.makeInvoiceTime = req.body.makeInvoiceTime;
	sell_order.invoiceExpressOrder = req.body.invoiceExpressOrder;
	sell_order.source = req.body.source;
	sell_order.category = req.body.category;
	sell_order.description = req.body.description;
	sell_order.salesman = req.body.salesman;
	
	console.log(sell_order);
	sellOrderProvider.save(sell_order , function(error , sell_order) {
		if(error) 
		 	res.send("error:"+error);
		else
		    res.send("success");
	});
}



exports.saleFileUploader = function(req , res) {
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

      var sellOrderArr = new Array();
      xlsx.SheetNames.forEach(function(y) {
      		if("销售"!=y) {
      			return false ;
      		}
      		console.log(y);
			var rows =  XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[y]);
			for(var i=0 , l=rows.length; i< l; ++i){
			    var arrayR = rows[i];
			    var sell_order = saleOrderHandler(arrayR);
                if(sell_order != null) {
                    sellOrderArr[sellOrderArr.length] = sell_order;
                }
			}
	  });
     sellOrderProvider.save(sellOrderArr , function(error , sellOrderArr){
            if(error) {
                res.send("error");
            } else {
                res.send(sellOrderArr);
            }
     });

    });
    
}


exports.queryShipmentCmp=function(res , req) {
    sellOrderProvider.queryShipmentCmp(function(error , shipmentCmps){
          if(error) {
              req.send("error");
          } else {
              req.json(shipmentCmps);
          }
    });
}


function saleOrderHandler(array) {
	var sell_order={};
	sell_order.shipmentDate = MyDateUtil.myDateFormat(array["发货日期"]);
	sell_order.shipmentCmp = array["出货单位"];
	sell_order.brand = array["品牌"];
	sell_order.name = array["品名"];
	sell_order.model = array["型号"];
	sell_order.amount = array["数量"];
	sell_order.unit = array["单位"];
	sell_order.unitPrice = array["单价"];
	sell_order.totalMoney = array["金额"];
	sell_order.actualCost = array["成本"];
	sell_order.receiveMoneyTime =  MyDateUtil.myDateFormat( array["收款时间"]);
	
	sell_order.receiveMoneyType = array["收款方式"];
	sell_order.payAmount = array["付款金额"];
	sell_order.unpayAmount = array["未付金额"];
	sell_order.shipmentOrder = array["出库单号"];
	sell_order.shipmentType = array["出货方式"];
	sell_order.receiver = array["收货人"];
	sell_order.receiverPhone = array["收货人电话"];
	sell_order.receiveAddress = array["收货地址"];
	sell_order.transpotOrder = array["运单号"];
	sell_order.taxOrder = array["税票号"];
	sell_order.taxAmount = array["税票金额"];
	sell_order.makeInvoiceTime = array["出票时间"];
	sell_order.invoiceExpressOrder = array["发票快递单号"];
	sell_order.source = array["来源"];
	sell_order.category = array["类别"];
	sell_order.description = array["备注"];
	sell_order.salesman = array["销售员"];
	return sell_order;
}


