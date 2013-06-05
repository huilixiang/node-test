/**
 * New node file
 */
var mongodb = require('mongodb'); 
var db_info = require('../db_info');

PurchaseOrderProvider = function() {
	var mongoserver = new mongodb.Server(db_info.host, db_info.port, {auto_reconnect:true});
	this.connector = new mongodb.Db("admin", mongoserver, {safe:false});
	this.connector.open(function(){});
};
PurchaseOrderProvider.prototype.getCollection = function(callback) {
	this.connector.collection('purchase_order' , function(error , purchase_collection){
		if(error)
		     callback(error);
		else 
		   callback(null , purchase_collection);
	
	});
};
PurchaseOrderProvider.prototype.statisticEnterRecord = function(callback) {
     this.getCollection(function(error , purchase_collection){
               if(error)  {
                   callback(error);
               } else {
                   purchase_collection.group({brand:1 , name:1 , model:1 , unitPrice:1} ,
                       {},{count : 0}  , function (obj, prev) { prev.count += obj.amount; },
                      true , function(error , results) {
                           callback(error , results);
                       }
                   );
               }
     });
}

PurchaseOrderProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error , purchase_collection) {
		if(error) {
		     callback(error);
		} else {
		   purchase_collection.find().toArray(function(error , results){
		   		if(error)
		   		   callback(error);
		   		else 
		   			callback(null , results);
		   });
		}
	});
};



PurchaseOrderProvider.prototype.findAllBuyer = function(callback) {
    this.getCollection(function(error , purchase_collection){
        if (!error) {
            purchase_collection.distinct('buyer',function(error , buyers){
                   callback(error , buyers);
            })

        } else {
            callback(error);
        }
    });

}

PurchaseOrderProvider.prototype.save = function(purchases , callback) {
	this.getCollection(function(error , purchase_collection){
		if(error) {
		   callback(error);
		} else {
			purchase_collection.insert(purchases , function(){
				callback(null , purchases);
			});
		} 
	});
};

PurchaseOrderProvider.prototype.pagedAccountPayable = function(startIndex , pageSize ,  orderPop ,buyer ,
                                                               startDate , endDate , callback){
    var self = this;
    var findJSON = {};
    if(buyer != null) {
        findJSON.buyer = new RegExp(buyer);
    }
    var dateJson = {};
    if(startDate != null) {
        dateJson.$gte =  startDate;
    }
    if(endDate != null) {
        dateJson.$lte = endDate;
    }
    if(startDate != null || endDate!=null) {
        findJSON.purchaseDate =  dateJson;
    }
    findJSON.payTime = null;
    var options = {'skip':startIndex , 'limit' : pageSize , 'sort':'purchaseDate'};
    self.pagedAll(findJSON , options , true ,  callback);
} ;

PurchaseOrderProvider.prototype.pagedPurchaseAll = function(startIndex , pageSize ,  orderPop ,buyer , startDate ,
                                                            endDate , callback){
    var self = this;
    orderPop = orderPop == null ? '_id' : orderPop;
    var findJSON = {};
    if(buyer != null) {
        findJSON.buyer = new RegExp(buyer);
    }
    var dateJson = {};
    if(startDate != null) {
        dateJson.$gte =  startDate;
    }
    if(endDate != null) {
        dateJson.$lte = endDate;
    }
    if(startDate != null || endDate!=null) {
        findJSON.purchaseDate =  dateJson;
    }
    var options = {'skip':startIndex , 'limit' : pageSize , 'sort':'purchaseDate'};
    self.pagedAll(findJSON , options , true ,  callback);
} ;


PurchaseOrderProvider.prototype.pagedAll = function(findJSON , options , needReverse  , callback) {
	this.getCollection(function(error , purchase_collection) {
		if(error) {
		     callback(error);
		} else {
		   purchase_collection.count(findJSON , function(error , count){
		   		if(error) {
		   		   callback(error);
		   		} else {
                   if(needReverse) {
                       var startIndex = options.skip;
                       var limit = options.limit;
                       startIndex = count-startIndex;
                       if(startIndex < limit) {
                            limit = startIndex;
                            startIndex = 0;
                           options.limit = limit;
                       }  else {
                           startIndex = startIndex - limit;
                       }
                       options.skip = startIndex;
                   }
				   purchase_collection.find(findJSON , options).toArray(function(error , results){
				   		if(error)
				   		   callback(error);
				   		else {
                            results =   needReverse?results.reverse():results;
                            callback(null , results , count);
                        }

				   });
		   		} 
		   });
		}
	});
};

PurchaseOrderProvider.prototype.deleteById = function(id , callback) {
	this.getCollection(function(error , cmp_col){
		if(error) {
			callback(error);
		} else {
			cmp_col.remove({_id:id},1);
		}
	});
}

exports.PurchaseOrderProvider = PurchaseOrderProvider;
