/**
 * New node file
 */
var mongodb = require('mongodb'); 
var db_info = require('../db_info');

UserProvider = function() {
	var mongoserver = new mongodb.Server(db_info.host, db_info.port, {auto_reconnect:true});
	this.connector = new mongodb.Db("admin", mongoserver, {safe:false});
	this.connector.open(function(){});
};

UserProvider.prototype.getCollection = function(callback) {
	this.connector.collection('user' , function(error , user_collection){
		if(error)
		     callback(error);
		else 
		   callback(null , user_collection);
	
	});
};

UserProvider.prototype.findAll = function(callback) {
	this.getColection(function(error , user_collection) {
		if(error) {
		     callback(error);
		} else {
		   user_collection.find().toArray(function(error , results){
		   		if(error)
		   		   callback(error);
		   		else 
		   			callback(null , results);
		   });
		}
	});
};

UserProvider.prototype.pagedAll = function(startIndex , pageSize ,  orderPop , callback) {
	this.getCollection(function(error , user_collection) {
		if(error) {
		     callback(error);
		} else {
		   user_collection.count(function(error , count) {
		   	 if(error) {
		   	 	callback(error);
		   	 } else {
		   	   orderPop = orderPop == null ? '_id' : orderPop;
			   user_collection.find({} , {'skip':startIndex , 'limit':pageSize , 'order':orderPop}).toArray(function(error , results){
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

UserProvider.prototype.queryTotalAmount = function(callback) {
	this.getCollection(function(error , user_collection){
		if(error) {
		   callback(error);
		} else {
			user_collection.find().count(function(error , count ){
				callback(error , count);
			});
		} 
	});
};

UserProvider.prototype.save = function(users , callback) {
	this.getCollection(function(error , user_collection){
		if(error) {
		   callback(error);
		} else {
			if(typeof(users.length) == 'undefined') {
				users = [users];
			} 
			user_collection.insert(users , function(){
				callback(null , users);
			});
		} 
	});
};

UserProvider.prototype.deleteById = function(id , callback) {
	this.getCollection(function(error , user_col){
		if(error) {
			callback(error);
		} else {
			user_col.remove({_id:id},1);
		}
	});
}

exports.UserProvider = UserProvider;