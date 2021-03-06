/**
 * New node file
 */
var mongodb = require('mongodb') , db_info = require('../db_info') , async = require('async');
RepertoryProvider = function() {
	var mongoserver = new mongodb.Server(db_info.host, db_info.port, {auto_reconnect:true});
	this.connector = new mongodb.Db("admin", mongoserver, {safe:false});
	this.connector.open(function(){});
};

RepertoryProvider.prototype.statistic = function(callback) {



}

RepertoryProvider.prototype.getCollection = function(callback) {
	this.connector.collection('repertory' , function(error , repertory_collection){
		if(error)
		     callback(error);
		else 
		   callback(null , repertory_collection);
	
	});
};

RepertoryProvider.prototype.findAll = function(callback) {
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


RepertoryProvider.prototype.save = function(repertorys , callback) {
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
			}
			repertory_collection.insert(repertorys , function(errors , repertorys){
				callback(errors , repertorys);
			});
		} 
	});
};

RepertoryProvider.prototype.pagedAll = function(startIndex , pageSize ,  orderPop , callback) {
	this.getCollection(function(error , repertory_collection) {
		if(error) {
		     callback(error);
		} else {
		   orderPop = orderPop == null ? '_id' : orderPop;
		   repertory_collection.count(function(error , count){
		   		if(error) {
		   		   callback(error);
		   		} else {
				   repertory_collection.find({} , {'skip':startIndex , 'limit':pageSize , 'order':orderPop})
                       .toArray(function(error , results){
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

RepertoryProvider.prototype.deleteById = function(id , callback) {
	this.getCollection(function(error , cmp_col){
		if(error) {
			callback(error);
		} else {
			cmp_col.remove({_id:id},1);
		}
	});
}

exports.RepertoryProvider = RepertoryProvider;
