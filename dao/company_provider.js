/**
 * New node file
 */
var mongodb = require('mongodb'); 
var db_info = require('../db_info');

CompanyProvider = function() {
	var mongoserver = new mongodb.Server(db_info.host, db_info.port, {auto_reconnect:true});
	this.connector = new mongodb.Db("admin", mongoserver, {safe:false});
	this.connector.open(function(){});
};
CompanyProvider.prototype.getCollection = function(callback) {
	this.connector.collection('company' , function(error , company_collection){
		if(error)
		     callback(error);
		else 
		   callback(null , company_collection);
	
	});
};

CompanyProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error , company_collection) {
		if(error) {
		     callback(error);
		} else {
		   company_collection.find().toArray(function(error , results){
		   		if(error)
		   		   callback(error);
		   		else 
		   			callback(null , results);
		   });
		}
	});
};


CompanyProvider.prototype.pagedAll = function(startIndex , pageSize ,  orderPop , name , callback) {
	this.getCollection(function(error , company_collection) {
		if(error) {
		     callback(error);
		} else {
		   var findJSON = {};
   		   if(name != null) {
   		   		findJSON.name = new RegExp(name);
   		   }
   		   console.log(findJSON);
		   company_collection.count(findJSON , function(error , count) {
		   	 if(error) {
		   	 	callback(error);
		   	 } else {
		   	    if(orderPop == null || orderPop == '') {
			   	   orderPop ='_id';
		   	 	}
			   company_collection.find(findJSON , {'skip':startIndex , 'limit':pageSize , 'order':orderPop}).toArray(function(error , results){
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


CompanyProvider.prototype.save = function(companys , callback) {
	this.getCollection(function(error , company_collection){
		if(error) {
		   callback(error);
		} else {
			company_collection.insert(companys , function(){
				callback(null , companys);
			});
		} 
	});
};

CompanyProvider.prototype.deleteById = function(id , callback) {
	this.getCollection(function(error , cmp_col){
		if(error) {
			callback(error);
		} else {
			cmp_col.remove({_id:id},1);
		}
	});
}

exports.CompanyProvider = CompanyProvider;
