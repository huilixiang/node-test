/**
 * New node file
 */

//新增采购
function newPurchaseOrder() {
	var purchaseDate =  $("#new_purchase_form input[name=purchaseDate]").val();
	var buyer = $("#new_purchase_form input[name=buyer]").val();
	var name = $("#new_purchase_form input[name=name]").val();
	var amount = $("#new_purchase_form input[name=amount]").val(); 
	var unitPrice = $("#new_purchase_form input[name=unitPrice]").val(); 
	var receiveTime = $("#new_purchase_form input[name=receiveTime]").val(); 
	var paymentType = $("#new_purchase_form input[name=paymentType]").val(); 
	var invoiceMoney = $("#new_purchase_form input[name=invoiceMoney]").val(); 
	var description = $("#new_purchase_form input[name=description]").val(); 
	var totalMoney = $("#new_purchase_form input[name=totalMoney]").val();
	var brand = $("#new_purchase_form input[name=brand]").val(); 
	var model = $("#new_purchase_form input[name=model]").val(); 
	var unit = $("#new_purchase_form input[name=unit]").val(); 
	var enterOrder = $("#new_purchase_form input[name=enterOrder]").val(); 
	var payTime = $("#new_purchase_form input[name=payTime]").val(); 
	var taxOrder = $("#new_purchase_form input[name=taxOrder]").val(); 
	var receiveInvoiceTime = $("#new_purchase_form input[name=receiveInvoiceTime]").val(); 
	var express = $("#new_purchase_form input[name=express]").val(); 
   
   $.post(
   		"/newpurchase.node",
   		
   		{
   		  purchaseDate:purchaseDate,
   		  buyer:buyer , 
   		  name:name, 
   		  amount:amount, 
   		  unitPrice:unitPrice,
   		  receiveTime:receiveTime,
   		  paymentType:paymentType,
   		  invoiceMoney:invoiceMoney,
   		  description:description,
   		  brand:brand,
   		  model:model,
   		  unit:unit,
   		  enterOrder:enterOrder,
   		  payTime:payTime,
   		  taxOrder:taxOrder,
   		  receiveInvoiceTime:receiveInvoiceTime,
   		  express:express,
   		  totalMoney:totalMoney
   		},
   		function(data) {
   			if(data == 'success') {
   				alert("保存成功");
   				$("#new_purchase_form")[0].reset();
   			} else {
   				alert("保存失败");
   			}
   		}
   );
}
 