var newArticleIdArr = new Array("new_company_article" , "new_purchase_article" , "repertory_list_article",
                        "new_sell_article" , "new_employee_article" , "ansell_glove_list_article",
                        "employee_list_article" , "sale_statistic_article" , "company_list_article",
                        "sample_list_article" , "seller_consume_list_article" , "purchase_statistic_article" ,
                        "unpaid_sale_statistic_article" , "unreceive_sale_statistic_article");
var companyArr = [];


	
$(document).ready(function() {
	initCompanyArr4AutoComplete();
});

//date picker options
var date_picker_options = {
	 dayNames    : ["周日" , "周一", "周二" , "周三","周四" , "周五","周六"],
	 dayNamesMin : ["周日" , "周一", "周二" , "周三","周四" , "周五","周六"],
	 monthNames  : ["1月" , "2月" , "3月" , "4月" , "5月" , "6月" , "7月" ,
	                "8月" , "9月" , "10月" , "11月" , "12月" ],
	 dateFormat  : "yy/mm/dd"
}

function createUser() {
	hideAll();
	$("#new_employee_article").show();
	$("#new_employee_form input[name=company]").autocomplete({
		source : companyArr
	});
}// end createUser



function hideAll() {
	for(var i in newArticleIdArr) {
		var articleId = newArticleIdArr[i];
		$("#"+articleId).hide();
	}
}//end hideAndShow


function showAll() {
	for(var i in newArticleIdArr) {
		var articleId = newArticleIdArr[i];
		$("#"+articleId).show();
	}
}//end hideAndShow

function initCompanyArr4AutoComplete() {
	if(companyArr.length > 0) {
		return ;
	}
	$.get(
		'/queryallcompany.node',
		function(result) {
			if(typeof(result) == 'undefined' || result.status == 'error') {
				alert("请求失败");
			} else {
				var companyList = result.rows;
				for(var i in companyList) {
					var company = companyList[i];
					if(company.name == null) {
						continue;
					}
					companyArr[companyArr.length] = company.name;
				}
			}
			
		}
	);
};//end initCompanyArr4AutoComplete

function showUser() {
	hideAll();
	$("#employee_list_article").show();
	$("#user_list_table").show();
	$("#user_list_table").flexigrid({
				url: '/queryalluser.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '用户名', name : 'username', width:113, sortable : true, align: 'left'},
					{display: '所在公司', name : 'company',width:113,  sortable : true, align: 'left'},
					{display: '电话', name : 'telephone', width:113, sortable : true, align: 'left'},
					{display: '手机', name : 'mobilephone',width:143,sortable : true, align: 'left'},
					{display: '地址', name : 'address', width:143, sortable : true, align: 'left'},
					{display: '邮箱', name : 'email',width:143,  sortable : true, align: 'left'},
                    {display: '角色', name : 'role',width:143,  sortable : true, align: 'left'},
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				title: '用户列表',
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
	});

}//end showUser

function newPurchase() {
	hideAll();
	$("#new_purchase_article").show();
	$("#receiveTime").datepicker(date_picker_options);
    $("#payTime").datepicker(date_picker_options);
    $("#purchaseDate").datepicker(date_picker_options);
    $("#receiveInvoiceTime").datepicker(date_picker_options);

    initPurchaseBuyer(function(){
        $("#buyer").autocomplete({
            source : purchaseBuyers
        });
    });
	
}// end newPurchase

var shipmentCmps4Sell = null;

function initShiptmentCmp4Sell(callback)  {
    if(shipmentCmps4Sell != null) {
        callback();
        return ;
    }

    $.get(
        '/query_sell_shipment_cmp.node',
        function(result) {
            if(typeof(result) == 'undefined' || result == 'error') {
                alert("请求失败");
            } else {
                purchaseBuyers = result;
                callback(result);
            }
        }
    );


}

function newSell() {
	hideAll();
	$("#new_sell_article").show();
    $("#makeInvoiceTime").datepicker(date_picker_options);
    $("#receiveMoneyTime").datepicker(date_picker_options);
    $("#shipmentDate").datepicker(date_picker_options);

	$("#new_sell_form input[name=seller]").autocomplete({
		source : companyArr
	});
}//end newSell

function querySaleStatisticByCnd() {

	var cmpName = $("#cmpNameSearchInput4Sale").val();
	var startDate = $("#startDateSearchInput4Sale").val();
	var endDate = $("#endDateSearchInput4Sale").val();
	var url = '/querysale.node';
	var paramarray = new Array();
	if(cmpName!=null && $.trim(cmpName) != "") {
		var param = {};
		param.name = 'shipmentCmp';
		param.value = cmpName;
		paramarray[paramarray.length] = param;
	}
	if(startDate!=null && $.trim(startDate) != "") {
		var param = {};
		param.name = 'startShipmentDate';
		param.value = startDate;
		paramarray[paramarray.length] = param;
	}
	if(endDate != null && $.trim(endDate) != "") {
		var param = {};
		param.name = 'endShipmentDate';
		param.value = endDate;
		paramarray[paramarray.length] = param;
	}
	$("#sale_statistic_list_table").flexOptions({params:paramarray}).flexReload();
}
function querySaleStatistic(url0 , paramarray) {
	hideAll();
	$("#cmpNameSearchInput4Sale").autocomplete({
		source : companyArr
	});
	$("#sale_statistic_article").show();
	$("#sale_statistic_list_table").flexigrid({
				url: '/querysale.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '发货时间', name : 'shipmentDate',  sortable : true, align: 'center'},
					{display: '出货单位', name : 'shipmentCmp',  sortable : true, align: 'left'},
					{display: '品牌', name : 'brand',  sortable : true, align: 'left'},
					{display: '品名', name : 'name',  sortable : true, align: 'left'},
					{display: '型号', name : 'model',  sortable : true, align: 'left'},
					{display: '数量', name : 'amount',  sortable : true, align: 'left'},
					{display: '单位', name : 'unit',  sortable : true, align: 'left'},
					{display: '单价', name : 'unitPrice',  sortable : true, align: 'left'},
					{display: '金额', name : 'totalMoney',  sortable : true, align: 'left'},
					{display: '成本', name : 'actualCost',  sortable : true, align: 'left'},
					{display: '收款时间', name : 'receiveMoneyTime',  sortable : true, align: 'left'},
					{display: '收款方式', name : 'receiveMoneyType',  sortable : true, align: 'left'},
					{display: '付款金额', name : 'payAmount',  sortable : true, align: 'left'},
					{display: '未付金额', name : 'unpayAmount',  sortable : true, align: 'left'},
					{display: '出库单号', name : 'shipmentOrder',  sortable : true, align: 'left'},
					{display: '出货方式', name : 'shipmentType',  sortable : true, align: 'left'},
					{display: '收货人', name : 'receiver',  sortable : true, align: 'left'},
					{display: '收货人电话', name : 'receiverPhone',  sortable : true, align: 'left'},
					{display: '收货地址', name : 'receiveAddress',  sortable : true, align: 'left'},
					{display: '运单号', name : 'transpotOrder',  sortable : true, align: 'left'},
					{display: '税票号', name : 'taxOrder',  sortable : true, align: 'left'},
					{display: '税票金额', name : 'taxAmount',  sortable : true, align: 'left'},
					{display: '出票时间', name : 'makeInvoiceTime',  sortable : true, align: 'left'},
					{display: '发票快递单号', name : 'invoiceExpressOrder',  sortable : true, align: 'left'},
					{display: '来源', name : 'source',  sortable : true, align: 'left'},
					{display: '备注', name : 'description',  sortable : true, align: 'left'},
					{display: '类别', name : 'category',  sortable : true, align: 'left'},
					{display: '销售员', name : 'salesman',  sortable : true, align: 'left'}  ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '出货单位', name : 'shipmentCmp', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				title: '销售订单列表',
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
			});
}

function saleStatistic() {
	$("#startDateSearchInput4Sale").datepicker(date_picker_options);
	$("#endDateSearchInput4Sale").datepicker(date_picker_options);
	querySaleStatistic('/querysale.node' , []);
}// end saleStatistic


function createNewCmp(){
	hideAll();
	$("#new_company_article").show();

}


function showCompany() {
	hideAll();
	$("#cmpNameSearchInput4Cmp").autocomplete({
		source : companyArr
	});
	$("#company_list_article").show();
	$("#company_list_table").flexigrid({
				url: '/query_paged_company.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '公司名称', name : 'name', width : 80, sortable : true, align: 'center'},
					{display: '合作类型', name : 'businessType', width : 80, sortable : true, align: 'left'},
					{display: '公司地址', name : 'address', width : 80, sortable : true, align: 'left'},
					{display: '开户银行', name : 'bank', width : 80, sortable : true, align: 'left'},
					{display: '帐号', name : 'bankAccount', width : 80, sortable : true, align: 'left'},
					{display: '税号', name : 'tax', width : 80, sortable : true, align: 'left'},
					{display: '公司电话', name : 'comTelephone', width : 80, sortable : true, align: 'left'},
					{display: '联系人', name : 'linkman', width : 80, sortable : true, align: 'left'},
					{display: '联系人电话', name : 'telephone', width : 80, sortable : true, align: 'left'},
					{display: '联系人手机', name : 'email', width : 80, sortable : true, align: 'left'},
					{display: '传真', name : 'fax', width : 80, sortable : true, align: 'left'},
					{display: '邮编', name : 'email', width : 80, sortable : true, align: 'left'},
					{display: '其它', name : 'other', width : 80, sortable : true, align: 'left'},
					{display: '备注', name : 'description', width : 80, sortable : true, align: 'left'},
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				title: '用户列表',
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
	});
}

//库存相关


function showRepertory() {
	hideAll();
	$("#repertory_list_article").show();
	$("#repertory_list_table").flexigrid({
				url: '/query_repertory.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '名称', name : 'name', width : 275, sortable : true, align: 'left'},
					{display: '型号', name : 'model', width : 100, sortable : true, align: 'left'},
					{display: '库存数', name : 'amount', width : 100, sortable : true, align: 'left'},
					{display: '成本单价', name : 'actualCostPerUnit', width : 100, sortable : true, align: 'left'},
					{display: '总成本', name : 'totalCost', width : 100, sortable : true, align: 'left'},
					{display: '市场价', name : 'marketPrice', width : 100, sortable : true, align: 'left'},
					{display: '备注', name : 'other', width : 100, sortable : true, align: 'left'} ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				title: '库存',
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
	});
}

//ansell手套
function showAnsellGloveRepertory() {
	hideAll();
	$("#ansell_glove_list_article").show();
	$("#ansell_glove_list_table").flexigrid({
				url: '/query_ansell_glove_repertory.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '名称', name : 'name', width : 235, sortable : true, align: 'left'},
					{display: '类别', name : 'category', width : 120, sortable : true, align: 'left'},
					{display: '描述', name : 'desc', width : 200, sortable : true, align: 'left'},
					{display: '型号', name : 'model', width : 80, sortable : true, align: 'left'},
					{display: '库存数', name : 'amount', width : 80, sortable : true, align: 'left'},
					{display: '成本单价', name : 'actualCostPerUnit', width : 80, sortable : true, align: 'left'},
					{display: '总成本', name : 'totalCost', width : 80, sortable : true, align: 'left'}  ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
	});

}


function showSampleFlow(){
	hideAll();
	$("#sample_list_article").show();
	$("#sample_list_table").flexigrid({
				url: '/query_sample_repertory.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '日期', name : 'date', width : 135, sortable : true, align: 'left'},
					{display: '品名', name : 'name', width : 235, sortable : true, align: 'left'},
					{display: '型号', name : 'model', width : 80, sortable : true, align: 'left'},
					{display: '数量', name : 'amount', width : 80, sortable : true, align: 'left'},
					{display: '单位', name : 'unit', width : 80, sortable : true, align: 'left'},
					{display: '流向', name : 'flow', width : 120, sortable : true, align: 'left'},
					{display: '备注', name : 'other', width : 200, sortable : true, align: 'left'},
					{display: '类别', name : 'category', width : 120, sortable : true, align: 'left'},
					{display: '业务员', name : 'operator', width : 80, sortable : true, align: 'left'},
					{display: '描述', name : 'desc', width : 80, sortable : true, align: 'left'} ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
	});

}// end showSampleFlow


function showSellerConsumeRecord() {
hideAll();
	$("#seller_consume_list_article").show();
	$("#seller_consume_list_table").flexigrid({
				url: '/query_seller_consume_record.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '日期', name : 'date', width : 135, sortable : true, align: 'left'},
					{display: '品名', name : 'name', width : 235, sortable : true, align: 'left'},
					{display: '型号', name : 'model', width : 80, sortable : true, align: 'left'},
					{display: '数量', name : 'amount', width : 80, sortable : true, align: 'left'},
					{display: '单位', name : 'unit', width : 80, sortable : true, align: 'left'},
					{display: '备注', name : 'other', width : 200, sortable : true, align: 'left'},
					{display: '是否归还', name : 'hasRestored', width : 80, sortable : true, align: 'left'},
					{display: '销售员', name : 'seller', width : 80, sortable : true, align: 'left'}   ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				usepager: true,
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
	});
}//end showSellerConsumeRecord 

var purchaseBuyers = null;

function initPurchaseBuyer(callback) {
    if(purchaseBuyers != null) {
        callback(purchaseBuyers);
        return ;
    }
    $.get(
        '/query_purchase_buyers.node',
        function(result) {
            if(typeof(result) == 'undefined' || result == 'error') {
                alert("请求失败");
            } else {

                purchaseBuyers = result;
                callback(result);
            }
        }
    );


}
function purchaseStatistic(){
	hideAll();
	$("#startDateSearchInput4Pur").datepicker(date_picker_options);
	$("#endDateSearchInput4Pur").datepicker(date_picker_options);

    initPurchaseBuyer(function(){
        $("#cmpNameSearchInput4Pur").autocomplete({
            source : purchaseBuyers
        });
    });

	$("#purchase_statistic_article").show();
	$("#purchase_statistic_list_table").flexigrid({
				url: '/query_purchase.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '进货时间', name : 'purchaseDate',  sortable : true, align: 'center'},
					{display: '进货单位', name : 'buyer',  sortable : true, align: 'left'},
					{display: '品牌', name : 'brand',  sortable : true, align: 'left'},
					{display: '品名', name : 'name',  sortable : true, align: 'left'},
					{display: '型号', name : 'model',  sortable : true, align: 'left'},
					{display: '数量', name : 'amount',  sortable : true, align: 'left'},
					{display: '单位', name : 'unit',  sortable : true, align: 'left'},
					{display: '单价', name : 'unitPrice',  sortable : true, align: 'left'},
					{display: '金额', name : 'totalMoney',  sortable : true, align: 'left'},
					{display: '出库单号', name : 'enterOrder',  sortable : true, align: 'left'},
					{display: '收货时间', name : 'receiveTime',  sortable : true, align: 'left'},
					{display: '付款时间', name : 'payTime',  sortable : true, align: 'left'},
					{display: '付款方式', name : 'payType',  sortable : true, align: 'left'},
					{display: '税票号', name : 'taxOrder',  sortable : true, align: 'left'},
					{display: '税票金额', name : 'invoiceMoney',  sortable : true, align: 'left'},
					{display: '收票时间', name : 'receiveInvoiceTime',  sortable : true, align: 'left'},
					{display: '备注', name : 'description',  sortable : true, align: 'left'},
					{display: '快递', name : 'express',  sortable : true, align: 'left'} ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '时间', name : 'createDate', isdefault: true}
				       		],
				**/
                singleSelect: true,
				usepager: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				title: '采购单列表',
				useRp: true,
				rp: 10,
				showTableToggleBtn: true,
				width: 980,
				height: 500
			});
}//end purchaseStatistic


function queryPurStatisticByCnd() {
	
	var cmpName = $("#cmpNameSearchInput4Pur").val();
	var startDate = $("#startDateSearchInput4Pur").val();
	var endDate = $("#endDateSearchInput4Pur").val();
	var url = '/querysale.node';
	var paramarray = new Array();
	if(cmpName!=null && $.trim(cmpName) != "") {
		var param = {};
		param.name = 'buyer';
		param.value = cmpName;
		paramarray[paramarray.length] = param;
	}
	if(startDate!=null && $.trim(startDate) != "") {
		var param = {};
		param.name = 'startPurchaseDate';
		param.value = startDate;
		paramarray[paramarray.length] = param;
	}
	if(endDate != null && $.trim(endDate) != "") {
		var param = {};
		param.name = 'endPurchaseDate';
		param.value = endDate;
		paramarray[paramarray.length] = param;
	}
	$("#purchase_statistic_list_table").flexOptions({params:paramarray}).flexReload();
} // end queryPurStatisticByCnd


function queryCmpByCnd() {
	var cmpName = $("#cmpNameSearchInput4Cmp").val();
	var url = '/query_paged_company.node';
	var paramarray = new Array();
	if(cmpName!=null && $.trim(cmpName) != "") {
		var param = {};
		param.name = 'name';
		param.value = cmpName;
		paramarray[paramarray.length] = param;
		$("#company_list_table").flexOptions({params:paramarray}).flexReload();
	} else {
		return ;
	}
}// end queryCmpByCnd


function queryUnReceiveSaleStatisticByCnd() {

    var cmpName = $("#cmpNameSearchInput4UnReceive").val();
    var startDate = $("#startDateSearchInput4UnReceive").val();
    var endDate = $("#endDateSearchInput4UnReceive").val();
    var paramarray = new Array();
    if(cmpName!=null && $.trim(cmpName) != "") {
        var param = {};
        param.name = 'shipmentCmp';
        param.value = cmpName;
        paramarray[paramarray.length] = param;
    }
    if(startDate!=null && $.trim(startDate) != "") {
        var param = {};
        param.name = 'startShipmentDate';
        param.value = startDate;
        paramarray[paramarray.length] = param;
    }
    if(endDate != null && $.trim(endDate) != "") {
        var param = {};
        param.name = 'endShipmentDate';
        param.value = endDate;
        paramarray[paramarray.length] = param;
    }
    $("#unreceive_sale_statistic_list_table").flexOptions({params:paramarray}).flexReload();
} //end queryUnReceiveSaleStatisticByCnd


function showAccountReceivableStatistic() {
	hideAll();
	$("#startDateSearchInput4UnReceive").datepicker(date_picker_options);
	$("#endDateSearchInput4UnReceive").datepicker(date_picker_options);
	$("#cmpNameSearchInput4UnReceive").autocomplete({
		source : companyArr
	});
	$("#unreceive_sale_statistic_article").show();
	$("#unreceive_sale_statistic_list_table").flexigrid({
				url: '/query_unreceived_sale.node',
				method: 'post',
				dataType: 'json',
				colModel : [
					{display: '发货时间', name : 'shipmentDate',  sortable : true, align: 'center'},
					{display: '出货单位', name : 'shipmentCmp',  sortable : true, align: 'left' , width:165},
					{display: '品牌', name : 'brand',  sortable : true, align: 'left'},
					{display: '品名', name : 'name',  sortable : true, align: 'left'},
					{display: '型号', name : 'model',  sortable : true, align: 'left'},
					{display: '数量', name : 'amount',  sortable : true, align: 'left' , hide:true},
					{display: '单位', name : 'unit',  sortable : true, align: 'left' , hide:true},
					{display: '单价', name : 'unitPrice',  sortable : true, align: 'left' , hide:true},
					{display: '金额', name : 'totalMoney',  sortable : true, align: 'left'},
					{display: '成本', name : 'actualCost',  sortable : true, align: 'left' , hide:true},
					{display: '收款时间', name : 'receiveMoneyTime',  sortable : true, align: 'left' , hide:true},
					{display: '收款方式', name : 'receiveMoneyType',  sortable : true, align: 'left' , hide:true},
					{display: '付款金额', name : 'payAmount',  sortable : true, align: 'left' , hide:true},
					{display: '未付金额', name : 'unpayAmount',  sortable : true, align: 'left' , hide:true},
					{display: '出库单号', name : 'shipmentOrder',  sortable : true, align: 'left'},
					{display: '出货方式', name : 'shipmentType',  sortable : true, align: 'left' , hide:true},
					{display: '收货人', name : 'receiver',  sortable : true, align: 'left'},
					{display: '收货人电话', name : 'receiverPhone',  sortable : true, align: 'left' , hide:true},
					{display: '收货地址', name : 'receiveAddress',  sortable : true, align: 'left' , hide:true},
					{display: '运单号', name : 'transpotOrder',  sortable : true, align: 'left' , hide:true},
					{display: '税票号', name : 'taxOrder',  sortable : true, align: 'left' , hide:true},
					{display: '税票金额', name : 'taxAmount',  sortable : true, align: 'left' , hide:true},
					{display: '出票时间', name : 'makeInvoiceTime',  sortable : true, align: 'left' , hide:true},
					{display: '发票快递单号', name : 'invoiceExpressOrder',  sortable : true, align: 'left' , hide:true},
					{display: '来源', name : 'source',  sortable : true, align: 'left' , hide:true},
					{display: '备注', name : 'description',  sortable : true, align: 'left' , hide:true},
					{display: '类别', name : 'category',  sortable : true, align: 'left' , hide:true},
					{display: '销售员', name : 'salesman',  sortable : true, align: 'left' , hide:true}   ,
                    {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
					],
			    /**
				searchitems : [
				       		{display: '出货单位', name : 'shipmentCmp', isdefault: true}
				       		],
				**/
                singleSelect: true,
				usepager: true,
				title: '应收帐款列表',
				useRp: true,
				rp: 15,
				showTableToggleBtn: true,
				pagestat:'显示 {from} to {to} of {total} 记录',
				width: 980,
				height: 500
			});
}//end showAccountReceivableStatistic



function queryUnPaySaleStatisticByCnd() {

    var cmpName = $("#cmpNameSearchInput4UnPay").val();
    var startDate = $("#startDateSearchInput4UnPay").val();
    var endDate = $("#endDateSearchInput4UnPay").val();
    var paramarray = new Array();
    if(cmpName!=null && $.trim(cmpName) != "") {
        var param = {};
        param.name = 'shipmentCmp';
        param.value = cmpName;
        paramarray[paramarray.length] = param;
    }
    if(startDate!=null && $.trim(startDate) != "") {
        var param = {};
        param.name = 'startShipmentDate';
        param.value = startDate;
        paramarray[paramarray.length] = param;
    }
    if(endDate != null && $.trim(endDate) != "") {
        var param = {};
        param.name = 'endShipmentDate';
        param.value = endDate;
        paramarray[paramarray.length] = param;
    }
    $("#unpaid_sale_statistic_list_table").flexOptions({params:paramarray}).flexReload();
}  // end      queryUnPaySaleStatisticByCnd



function showAccountPayableStatistic() {
    hideAll();
    $("#startDateSearchInput4UnPay").datepicker(date_picker_options);
    $("#endDateSearchInput4UnPay").datepicker(date_picker_options);
    $("#cmpNameSearchInput4UnPay").autocomplete({
        source : companyArr
    });
    $("#unpaid_sale_statistic_article").show();
    $("#unpaid_sale_statistic_list_table").flexigrid({
        url: '/query_unpaied_purchase.node',
        method: 'post',
        dataType: 'json',
        colModel : [
            {display: '进货时间', name : 'purchaseDate',  sortable : true, align: 'center'},
            {display: '进货单位', name : 'buyer',  sortable : true, align: 'left' , width:160},
            {display: '品牌', name : 'brand',  sortable : true, align: 'left'},
            {display: '品名', name : 'name',  sortable : true, align: 'left'},
            {display: '型号', name : 'model',  sortable : true, align: 'left'},
            {display: '数量', name : 'amount',  sortable : true, align: 'left' , hide:true},
            {display: '单位', name : 'unit',  sortable : true, align: 'left' , hide:true},
            {display: '单价', name : 'unitPrice',  sortable : true, align: 'left' , hide:true},
            {display: '金额', name : 'totalMoney',  sortable : true, align: 'left'},
            {display: '出库单号', name : 'enterOrder',  sortable : true, align: 'left'},
            {display: '收货时间', name : 'receiveTime',  sortable : true, align: 'left'},
            {display: '付款时间', name : 'payTime',  sortable : true, align: 'left' , hide:true},
            {display: '付款方式', name : 'paymentType',  sortable : true, align: 'left' , hide:true},
            {display: '税票号', name : 'taxOrder',  sortable : true, align: 'left' , hide:true},
            {display: '税票金额', name : 'invoiceMoney',  sortable : true, align: 'left' , hide:true},
            {display: '收票时间', name : 'receiveInvoiceTime',  sortable : true, align: 'left' , hide:true},
            {display: '备注', name : 'description',  sortable : true, align: 'left' , hide:true},
            {display: '快递', name : 'express',  sortable : true, align: 'left' , hide:true} ,
            {display: 'id', name : '_id',  sortable : true, align: 'left' , hide:true}
        ],
        buttons : [
            {name: '删除', bclass: 'delete', onpress : doCommand},
            {separator: true},
            {name: '付款', bclass: 'edit', onpress : doCommand},
            {separator: true}
        ],
        /**
         searchitems : [
         {display: '出货单位', name : 'shipmentCmp', isdefault: true}
         ],
         **/
        singleSelect: true,
        usepager: true,
        title: '待付款列表',
        useRp: true,
        rp: 15,
        showTableToggleBtn: true,
        pagestat:'显示 {from} to {to} of {total} 记录',
        width: 980,
        height: 500
    });
}


function doCommand(com, grid) {
    if (com == '付款') {
        $('.trSelected', grid).each(function() {
            $(this).children("td").each(function(){
                var abbr = $(this).attr('abbr');
                if(abbr == '_id') {
                    alert($(this).children().first().html());
                }
            });

        });
    } else if (com == '删除') {
        $('.trSelected', grid).each(function() {
            $(this).children("td").each(function(){
                var abbr = $(this).attr('abbr');
                if(abbr == '_id') {
                    alert($(this).children().first().html());
                }
            });
        });
    }
}



