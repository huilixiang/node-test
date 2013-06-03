/**
 * New node file
 */
//新增合作企业
function newCompany() {
	var companyName = $("#new_company_form input[name=companyName]").val();
	var bank = $("#new_company_form input[name=bank]").val();
	var address = $("#new_company_form input[name=address]").val(); 
	var comTelephone = $("#new_company_form input[name=comTelephone]").val(); 
	var mobilePhone = $("#new_company_form input[name=mobilePhone]").val(); 
	var fax = $("#new_company_form input[name=fax]").val(); 
	var postcode = $("#new_company_form input[name=postcode]").val(); 
	var businessType = $("#new_company_form select[name=businessType] option[selected]").val(); 
	var bankAccount = $("#new_company_form input[name=bankAccount]").val(); 
	var tax = $("#new_company_form input[name=tax]").val(); 
	var linkman = $("#new_company_form input[name=linkman]").val(); 
	var telephone = $("#new_company_form input[name=telephone]").val(); 
	var other = $("#new_company_form input[name=other]").val(); 
	var description = $("#new_company_form input[name=description]").val(); 
   
   $.post(
   		"/newcompany.node",
   		{ companyName : companyName , 
   		  bank:bank, 
   		  address: address, 
   		  comTelephone:comTelephone,
   		  mobilePhone:mobilePhone,
   		  fax:fax,
   		  postcode:postcode,
   		  businessType:businessType,
   		  bankAccount:bankAccount,
   		  tax:tax,
   		  linkman:linkman,
   		  telephone:telephone,
   		  other:other,
   		  description:description
   		},
   		function(data) {
   			if(data == 'success') {
   				alert("保存成功");
   				$("#new_company_form")[0].reset();
   			} else {
   				alert("保存失败");
   			}
   		}
   );	
}

 