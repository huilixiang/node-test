/**
 * New node file
 */
//新增销售
function newSaleOrder() {
	var shipmentDate = $("#new_sell_form input[name=shipmentDate]").val();
	var seller = $("#new_sell_form input[name=seller]").val();
	var brand = $("#new_sell_form input[name=brand]").val(); 
	var name = $("#new_sell_form input[name=name]").val();
	var model = $("#new_sell_form input[name=model]").val(); 
	var amount = $("#new_sell_form input[name=amount]").val(); 
	var unit = $("#new_sell_form input[name=unit]").val();
	var unitPrice = $("#new_sell_form input[name=unitPrice]").val(); 
	var totalMoney = $("#new_sell_form input[name=totalMoney]").val();
	var actualCost = $("#new_sell_form input[name=actualCost]").val(); 
	var receiveMoneyTime = $("#new_sell_form input[name=receiveMoneyTime]").val(); 
	var receiveMoneyType = $("#new_sell_form input[name=receiveMoneyType]").val();
	var payAmount = $("#new_sell_form input[name=payAmount]").val();
	var unpayAmount = $("#new_sell_form input[name=unpayAmount]").val();
	var payAmount = $("#new_sell_form input[name=payAmount]").val();
	var shipmentOrder = $("#new_sell_form input[name=shipmentOrder]").val(); 
	var shipmentType = $("#new_sell_form input[name=shipmentType]").val();
	var receiver = $("#new_sell_form input[name=receiver]").val(); 
	var receiverPhone = $("#new_sell_form input[name=receiverPhone]").val();
	var receiveAddress = $("#new_sell_form input[name=receiveAddress]").val(); 
	var transpotOrder = $("#new_sell_form input[name=transpotOrder]").val(); 
	var taxOrder = $("#new_sell_form input[name=taxOrder]").val();
	var taxAmount = $("#new_sell_form input[name=taxAmount]").val();
	var makeInvoiceTime = $("#new_sell_form input[name=makeInvoiceTime]").val();
	var invoiceExpressOrder = $("#new_sell_form input[name=invoiceExpressOrder]").val(); 
	var source = $("#new_sell_form input[name=source]").val(); 
	var description = $("#new_sell_form input[name=description]").val(); 
	var category = $("#new_sell_form input[name=category]").val(); 
	var salesman = $("#new_sell_form input[name=salesman]").val();
   $.post(
   		"/newsell.node",
   		{ 
   		  shipmentDate:shipmentDate,
   		  shipmentCmp: seller , 
   		  brand : brand,
   		  name : name, 
   		  model : model,
   		  amount : amount, 
   		  unit : unit ,
   		  unitPrice : unitPrice,
   		  totalMoney : totalMoney,
   		  actualCost : actualCost,
   		  receiveMoneyTime : receiveMoneyTime,
   		  receiveMoneyType : receiveMoneyType,
   		  payAmount : payAmount,
   		  unpayAmount : unpayAmount,
   		  shipmentOrder : shipmentOrder,
   		  shipmentType : shipmentType,
   		  receiver : receiver,
   		  receiverPhone : receiverPhone ,
   		  receiveAddress : receiveAddress,
   		  transpotOrder : transpotOrder , 
   		  taxOrder : taxOrder,
   		  taxAmount:taxAmount,
   		  makeInvoiceTime : makeInvoiceTime,
   		  invoiceExpressOrder : invoiceExpressOrder,
   		  source : source,
   		  description : description,
   		  salesman : salesman,
   		  category : category,
   		  salesman:salesman
   		},
   		function(data) {
   			if(data == 'success') {
   				alert("保存成功");
   				$("#new_sell_form")[0].reset();
   			} else {
   				alert("保存失败");
   			}
   		}
   );
}
 