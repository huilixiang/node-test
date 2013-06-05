/**
 * New node file
 */

var jgpattern =/^[A-Za-z0-9]+$/;
//新增用户
function newEmployee() {
    var username = $("#new_employee_form input[name=username]").val();
	var telephone = $("#new_employee_form input[name=telephone]").val();
	var address = $("#new_employee_form input[name=address]").val(); 
	var mobilePhone = $("#new_employee_form input[name=mobilephone]").val(); 
	var email = $("#new_employee_form input[name=email]").val();
    //var company = $("#new_employee_form input[name=company]").val();
    var role = $("#roleselector").val();
    var password = $("#password").val();
    var repassword = $("#repassword").val();
    if(password == null) {
        alert("请填写密码");
        return ;
    }
    if(!jgpattern.test(password)) {
        alert("密码只能为字母或数字");
        return ;
    }
    if(password != repassword) {
        alert("再次输入的密码不一致");
        return ;
    }
   $.post(
   		"/newemployee.node",
   		{ username : username , 
   		  telephone:telephone,
   		  address: address, 
   		  mobilephone:mobilePhone,
   		  email:email,
   		  role:role,
          password : password
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


 