var mongodb = require('mongodb');
  //  mongoServer = new mongodb.Server('127.0.0.1' , 1987 , {} );
  // db_connector = new mongodb.Db('log' , mongoServer , {safe:true});
	

	
exports.log = function(req, res){
	
	var log = {};	
	log.behvType = req.query.behvType;
	log.attachment = req.query.attachment;
	log.uId = req.query.uId;
	log.userID = req.query.userID;
	log.time = req.query.time;
	log.pinId = req.query.pinId;
	log.inviteList = req.query.inviteList;
	log.refer = req.get('Referer');
	if(!log.behvType) {
		log.behvType = 999;
	}
	if(!log.attachment) {
		log.attachment=null;
	}
	if(!log.uId && !log.userID) {
		log.uId = Math.floor(Math.random()*10000);
	}
	if(!log.time) {
		log.time = null;
	}
	if(!log.pinId) {
		log.pinId = null;
	}
	
	console.log(log);
	mongodb.connect('mongodb://localhost:27017/log', function(err, conn){
		if(err) {
			console.log("--------------error ocurred when connected to mongodb----------");
		}
		conn.collection("log" , function(err , coll){
		    console.log("before insert ==============================");
			coll.insert(log , {safe: true}, function(err, records){
				console.log("Record added as "+records[0]._id);
				conn.close();
			});
		});
	
	});
	
	/*
	db_connector.open(function(err , db){
		console.log("before insert ==============================");
		if(err) {
			throw err;
		}
		
		db.createCollection("log", function(err, collection){
			collection.insert(log , {safe: true}, function(err, records){
				console.log("Record added as "+records[0]._id);
				db_connector.close();
			});
		});
	});
	*/
};
