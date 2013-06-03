/**
 * New node file
 */
exports.parseDate=function(dateStr) {
	var miliseconds = Date.parse(dateStr); 
	if(isNaN(miliseconds))  {
		return null;
	}
	var date = new Date();
	date.setTime(miliseconds);
	return date;
}

exports.myDateFormat=function(dateStr) {
    var date = this.parseDate(dateStr);
    if(date == null) {
        return null;
    }
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var d = date.getDate();
   /**
    var hour = date.getHours();
    var mi = date.getMinutes();
    var second = date.getSeconds();
   **/
   var mStr = month+"";
    if(month < 10) {
        mStr = "0"+month;
    }
    var dStr = d+"";
    if(d < 10) {
        dStr = "0"+d;
    }
    var formatedStr = year+"/"+mStr+"/"+dStr;
    return    formatedStr;
}