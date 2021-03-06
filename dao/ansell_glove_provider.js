/**
 * New node file
 */
var mongodb = require('mongodb'); 
var db_info = require('../db_info');

AnsellGloveRepertoryProvider = function() {
	var mongoserver = new mongodb.Server(db_info.host, db_info.port, {auto_reconnect:true});
	this.connector = new mongodb.Db("admin", mongoserver, {safe:false});
	this.connector.open(function(){});
};
AnsellGloveRepertoryProvider.prototype.getCollection = function(callback) {
	this.connector.collection('ansell_glove_repertory' , function(error , repertory_collection){
		if(error)
		     callback(error);
		else 
		   callback(null , repertory_collection);
	
	});
};

AnsellGloveRepertoryProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error , repertory_collection) {
		if(error) {
		     callback(error);
		} else {
		   repertory_collection.find().toArray(function(error , results){
		   		if(error)
		   		   callback(error);
		   		else 
		   			callback(null , results);
		   });
		}
	});
};


AnsellGloveRepertoryProvider.prototype.save = function(repertorys , callback) {
	this.getCollection(function(error , repertory_collection){
		if(error) {
		   callback(error);
		} else {
			if(typeof(repertorys.length) == 'undefined') {
				repertorys = [repertorys];
			} 
			for(var i=0,len=repertorys.length; i<len; ++i) {
				repertory = repertorys[i];
				repertory.createDate = new Date();
				if(repertory.employess == undefined)
					repertory.employess = [];
			}
			repertory_collection.insert(repertorys , function(){
				callback(null , repertorys);
			});
		} 
	});
};

AnsellGloveRepertoryProvider.prototype.pagedAll = function(startIndex , pageSize ,  orderPop , callback) {
	this.getCollection(function(error , repertory_collection) {
		if(error) {
		     callback(error);
		} else {
		   orderPop = orderPop == null ? '_id' : orderPop;
		   repertory_collection.count(function(error , count){
		   		if(error) {
		   		   callback(error);
		   		} else {
				   repertory_collection.find({} , {'skip':startIndex , 'limit':pageSize , 'order':orderPop}).toArray(function(error , results){
				   		if(error)
				   		   callback(error);
				   		else 
				   			callback(null , results , count);
				   });
		   		} 
		   });
		}
	});
};

AnsellGloveRepertoryProvider.prototype.deleteById = function(id , callback) {
	this.getCollection(function(error , cmp_col){
		if(error) {
			callback(error);
		} else {
			cmp_col.remove({_id:id},1);
		}
	});
}

exports.AnsellGloveRepertoryProvider = AnsellGloveRepertoryProvider;
