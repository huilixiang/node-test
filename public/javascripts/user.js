/**
 * New node file
 */
//新增用户
function newEmployee() {
    var username = $("#new_employee_form input[name=username]").val();
	var telephone = $("#new_employee_form input[name=telephone]").val();
	var address = $("#new_employee_form input[name=address]").val(); 
	var mobilePhone = $("#new_employee_form input[name=mobilephone]").val(); 
	var email = $("#new_employee_form input[name=email]").val();
	var company = $("#new_employee_form input[name=company]").val();
	
   $.post(
   		"/newemployee.node",
   		{ username : username , 
   		  telephone:telephone,
   		  address: address, 
   		  mobilephone:mobilePhone,
   		  email:email,
   		  company:company
   		},
   		function(data) {
   			if(data == 'success') {
   				alert("保存成功");
   				$("#new_employee_form")[0].reset();
   			} else {
   				alert("保存失败");
   			}
   		}
   );
}


 