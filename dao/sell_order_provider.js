/**
 * New node file
 */
var mongodb = require('mongodb'); 
var db_info = require('../db_info');

SellOrderProvider = function() {
	var mongoserver = new mongodb.Server(db_info.host, db_info.port, {auto_reconnect:true});
	this.connector = new mongodb.Db("admin", mongoserver, {safe:false});
	this.connector.open(function(){});
};
SellOrderProvider.prototype.getCollection = function(callback) {
	this.connector.collection('sell_order' , function(error , sell_collection){
		if(error)
		     callback(error);
		else 
		   callback(null , sell_collection);
	
	});
};

SellOrderProvider.prototype.statisticExitRecord = function(callback) {
    this.getCollection(function(error , sell_collection){
        if(error)  {
            callback(error);
        } else {
            sell_collection.group({brand:1 , name:1 , model:1 , unitPrice:1} ,
                {},{count : 0}  , function (obj, prev) { prev.count += obj.amount; },
                true , function(error , results) {
                    callback(error , results);
                }
            );
        }
    });
}


SellOrderProvider.prototype.queryShipmentCmp = function(callback) {
    this.getCollection(function(error , sell_collection){
         if(error) {
             callback(error);
             return ;
         }
         sell_collection.distinct('shipmentCmp' , function(error , shipmentCmps) {
             if(error) {
                 callback(error);
                 return ;
             }
             callback(null , shipmentCmps);

         });
    })  ;

}


SellOrderProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error , sell_collection) {
		if(error) {
		     callback(error);
		} else {
		   sell_collection.find().toArray(function(error , results){
		   		if(error)
		   		   callback(error);
		   		else 
		   			callback(null , results);
		   });
		}
	});
};


SellOrderProvider.prototype.save = function(sells , callback) {
	this.getCollection(function(error , sell_collection){
		if(error) {
		   callback(error);
		} else {
			sell_collection.insert(sells , function(){
				callback(null , sells);
			});
		} 
	});
};

SellOrderProvider.prototype.pagedAccountReceivableAll = function(startIndex , pageSize , shipmentCmp , startDate ,
                                                                 endDate , orderPop ,  callback) {
   var self = this;
   var findJSON = {};
   if(shipmentCmp != null) {
        findJSON.shipmentCmp = new RegExp(shipmentCmp);
   }
   var dateJson = {};
   if(startDate != null) {
        dateJson.$gte =  startDate;
   }
   if(endDate != null) {
        dateJson.$lte = endDate;
   }
   if(startDate != null || endDate!=null) {
       findJSON.shipmentDate =  dateJson;
   }
   //未付款 , 只有在设置时候才起作用
   findJSON.receiveMoneyTime = null;
   console.log(findJSON);
    var options = {'skip':startIndex , 'limit' : pageSize , 'sort':'shipmentDate'};
   self.pagedAll(options , findJSON , true ,callback);

};


SellOrderProvider.prototype.pagedSaleAll = function(startIndex , pageSize , shipmentCmp , startDate ,
                                                    endDate , orderPop ,  callback) {
   var self = this;
   var findJSON = {};
   if(shipmentCmp != null) {
        findJSON.shipmentCmp = new RegExp(shipmentCmp);
   }
   var dateJson = {};
   if(startDate != null) {
        dateJson.$gte =  startDate;
   }
   if(endDate != null) {
        dateJson.$lte = endDate;
   }
   if(startDate != null || endDate!=null) {
       findJSON.shipmentDate =  dateJson;
   }
   console.log(findJSON);

   var options = {'skip':startIndex , 'limit' : pageSize , 'sort':'shipmentDate'};
   self.pagedAll(options , findJSON , true , callback);
};


SellOrderProvider.prototype.pagedAll = function(options , findJSON , needReverse  ,  callback) {
	this.getCollection(function(error , sell_collection) {
		if(error) {
		     callback(error);
		} else {
		   sell_collection.count(findJSON , function(error , count){
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
		   		   console.log(findJSON);
				   sell_collection.find(findJSON , options).toArray(function(error , results){
				   		if(error)
				   		   callback(error);
				   		else  {
                            results =   needReverse?results.reverse():results;
                            callback(null , results , count);
                        }

				   });
		   		} 
		   });
		}
	});
};

SellOrderProvider.prototype.deleteById = function(id , callback) {
	this.getCollection(function(error , cmp_col){
		if(error) {
			callback(error);
		} else {
			cmp_col.remove({_id:id},1);
		}
	});
}

exports.SellOrderProvider = SellOrderProvider;
