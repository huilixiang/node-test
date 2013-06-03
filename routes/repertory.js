var RepertoryProvider = require('../dao/repertory_provider').RepertoryProvider ,
          fs = require('fs')	, mime = require('mime') , readline = require('readline')
          , AnsellGloveRepertoryProvider = require('../dao/ansell_glove_provider').AnsellGloveRepertoryProvider
          , SampleRepertoryProvider = require('../dao/sample_repertory_provider').SampleRepertoryProvider
          , SellerConsumeRecordProvider = require('../dao/seller_consume_provider').SellerConsumeRecordProvider
          , XLSX = require("xlsx") , BufferHelper = require("bufferhelper");

var repertoryProvider = new RepertoryProvider();
var ansellGloveProvider = new AnsellGloveRepertoryProvider();
var sampleProvider = new SampleRepertoryProvider();
var sellerConsumeRecordProvider = new SellerConsumeRecordProvider();
exports.enter = function(req , res) {


}

exports.querySellerConsumeRecord = function(req , res) {
	var result = {};
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var startIndex = (page-1) * rp;
	
	sellerConsumeRecordProvider.pagedAll(startIndex , rp , sortname ,  function(error , repertorys , totalCount){
		if(error) {
			result.status = 'error';
			res.send(result);
		} else {
			result.status = 'success';
			result.rows = repertorys;
			result.total = totalCount;
			result.page = page;
			res.json(result);
		}
	});

}

exports.querySampleRepertory = function(req , res) {
	var result = {};
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var startIndex = (page-1) * rp;
	
	sampleProvider.pagedAll(startIndex , rp , sortname ,  function(error , repertorys , totalCount){
		if(error) {
			result.status = 'error';
			res.send(result);
		} else {
			result.status = 'success';
			result.rows = repertorys;
			result.total = totalCount;
			result.page = page;
			res.json(result);
		}
	});

}


exports.queryRepertory = function(req , res) {
	var result = {};
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var startIndex = (page-1) * rp;
	
	repertoryProvider.pagedAll(startIndex , rp , sortname ,  function(error , repertorys , totalCount){
		if(error) {
			result.status = 'error';
			res.send(result);
		} else {
			result.status = 'success';
			result.rows = repertorys;
			result.total = totalCount;
			result.page = page;
			res.json(result);
		}
	});

}
exports.queryAnsellGloveRepertory = function(req , res) {
	var result = {};
	var page = req.body.page;
	var rp = req.body.rp;
	var sortname = req.body.sortname;
	var sortorder = req.body.sortorder;
	page = page == null?1:page;
	rp = rp==null?10:rp;
	var startIndex = (page-1) * rp;
	
	ansellGloveProvider.pagedAll(startIndex , rp , sortname ,  function(error , repertorys , totalCount){
		if(error) {
			result.status = 'error';
			res.send(result);
		} else {
			result.status = 'success';
			result.rows = repertorys;
			result.total = totalCount;
			result.page = page;
			res.json(result);
		}
	});

}


exports.sellerConsumeRecordFileUpload = function(req ,res) {
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
      var bufferH = new BufferHelper();
      var totalLen = 0;
     
      		
     	 fs.open('./uploadfs/content.txt', 'a', 0666, function(err, fd){  
	    	if (err) throw err;  
	    	var str = "";
	 	 	xlsx.SheetNames.forEach(function(y) {
	 	 		str +=y+";<br/>";
			    var rows =  XLSX.utils.sheet_to_row_object_array(xlsx.Sheets[y]);
			    
			    for(var i=0 , l=rows.length; i< l; ++i){
			    	var arrayR = rows[i];
			    	for(key in arrayR) {
				    	str += key+" : "+arrayR[key]+" ; ";
			    	}
			    	str +="<br/>";
			    }
			 	for (z in xlsx.Sheets[y]) {
			      if(z[0] === '!') continue;
			      var temp_str = y + "!" + z + "=" + JSON.stringify(xlsx.Sheets[y][z].v)+"\n";
				  var buffer = new Buffer(temp_str);
				  
			      fs.write(fd, buffer, 0, buffer.length, totalLen, function(err){
			      		if(err)  throw err;
			      });  
				  totalLen += 	buffer.length;	      
			    }
		   });
		   res.send(str);
		}); 
    });
  	
  	/**
  	
  	var rd = readline.createInterface({input : fs.createReadStream(path), output:process.stdout, terminal:false});
  	var str="";
  	var index = 0;
  	rd.on('line' , function(line){
  		var temp = line.split(",");
  		
  		
	  	var repertory_item = sellerConsumeRecordHander(line);
	  	sellerConsumeRecordProvider.save(repertory_item , function(error , repertory_item) {
			if(error) {
				console.error(line);
			} else {
				console.log(repertory_item);
			}
		});
		
		
  		str += "<tr>";
  		for(var i=0, len=temp.length; i<len; ++i) {
  			str += "<td width='250px;'>"+temp[i]+"</td>";
  		}
  		str += "</tr>";
  		
  	});
  	rd.on('close' , function(){
  		console.log("end");
  		var temp  = "<html><body><table style='width:5000px;'>"+str+ "</table></body></html>";
  		res.send(temp);
  	});
	**/
}


exports.sampleFileUpload = function(req ,res) {
	var path = req.files.thumbnail.path;
	var size = req.files.thumbnail.size;
  	var name = req.files.thumbnail.name;
  	console.log(req.files.thumbnail);
  	var rd = readline.createInterface({input : fs.createReadStream(path), output:process.stdout, terminal:false});
  	var str="";
  	var index = 0;
  	rd.on('line' , function(line){
  		var temp = line.split(",");
  		
  		
	  	var repertory_item = sampleRepertoryHandler(line);
	  	sampleProvider.save(repertory_item , function(error , repertory_item) {
			if(error) {
				console.error(line);
			} else {
				console.log(repertory_item);
			}
		});
		
		
  		str += "<tr>";
  		for(var i=0, len=temp.length; i<len; ++i) {
  			str += "<td width='250px;'>"+temp[i]+"</td>";
  		}
  		str += "</tr>";
  		
  	});
  	rd.on('close' , function(){
  		console.log("end");
  		var temp  = "<html><body><table style='width:5000px;'>"+str+ "</table></body></html>";
  		res.send(temp);
  	});

}

exports.ansellGloveFileUpload = function(req ,res) {
	var path = req.files.thumbnail.path;
	var size = req.files.thumbnail.size;
  	var name = req.files.thumbnail.name;
  	console.log(req.files.thumbnail);
  	var rd = readline.createInterface({input : fs.createReadStream(path), output:process.stdout, terminal:false});
  	var str="";
  	var index = 0;
  	rd.on('line' , function(line){
  		var temp = line.split(",");
  		
  		
	  	var repertory_item = ansellGloveRepertoryHandler(line);
	  	ansellGloveProvider.save(repertory_item , function(error , repertory_item) {
			if(error) {
				console.error(line);
			} else {
				console.log(repertory_item);
			}
		});
		
		
  		str += "<tr>";
  		for(var i=0, len=temp.length; i<len; ++i) {
  			str += "<td width='250px;'>"+temp[i]+"</td>";
  		}
  		str += "</tr>";
  		
  	});
  	rd.on('close' , function(){
  		console.log("end");
  		var temp  = "<html><body><table style='width:5000px;'>"+str+ "</table></body></html>";
  		res.send(temp);
  	});

}

exports.repertoryFileUpload = function(req , res){
	var path = req.files.thumbnail.path;
	var size = req.files.thumbnail.size;
  	var name = req.files.thumbnail.name;
  	console.log(req.files.thumbnail);
  	var rd = readline.createInterface({input : fs.createReadStream(path), output:process.stdout, terminal:false});
  	var str="";
  	var index = 0;
  	rd.on('line' , function(line){
  		var temp = line.split(",");
  		
  		
	  	var repertory_item = repertoryEnterHandler(line);
	  	repertoryProvider.save(repertory_item , function(error , repertory_item) {
			if(error) {
				console.error(line);
			} else {
				console.log(repertory_item);
			}
		});
		
		
  		str += "<tr>";
  		for(var i=0, len=temp.length; i<len; ++i) {
  			str += "<td width='250px;'>"+temp[i]+"</td>";
  		}
  		str += "</tr>";
  		
  	});
  	rd.on('close' , function(){
  		console.log("end");
  		var temp  = "<html><body><table style='width:5000px;'>"+str+ "</table></body></html>";
  		res.send(temp);
  	});
}


function sampleRepertoryHandler(line) {
	var temp = line.split(",");
	var repertory_item={};
	repertory_item.date=temp[0];
	repertory_item.name=temp[1];
	repertory_item.model=temp[2];
	repertory_item.amount=temp[3];
	repertory_item.unit=temp[4];
	repertory_item.flow=temp[5];
	repertory_item.other = temp[6];
	repertory_item.category=temp[7];
	repertory_item.operator=temp[8];
	repertory_item.desc=temp[9];
	return repertory_item;

}


function ansellGloveRepertoryHandler(line) {
	var temp = line.split(",");
	var repertory_item={};
	repertory_item.name=temp[0];
	repertory_item.category=temp[1];
	repertory_item.desc=temp[2];
	repertory_item.model=temp[3];
	repertory_item.amount=temp[4];
	repertory_item.actualCostPerUnit=temp[5];
	repertory_item.totalCost=temp[6];
	repertory_item.marketPrice = "";
	repertory_item.other = "";
	return repertory_item;

}

function repertoryEnterHandler(line) {
	var temp = line.split(",");
	var repertory_item={};
	repertory_item.name=temp[0];
	repertory_item.model=temp[1];
	repertory_item.amount=temp[2];
	repertory_item.actualCostPerUnit=temp[3];
	repertory_item.totalCost=temp[4];
	repertory_item.marketPrice = "";
	repertory_item.other = "";
	return repertory_item;
}

function sellerConsumeRecordHander(line) {
	var temp = line.split(",");
	var repertory_item={};
	repertory_item.date=temp[0];
	repertory_item.name=temp[1];
	repertory_item.model=temp[2];
	repertory_item.amount=temp[3];
	repertory_item.unit=temp[4];
	repertory_item.other = temp[5];
	repertory_item.hasRestored=temp[6];
	repertory_item.seller=temp[7];
	return repertory_item;
	
}
