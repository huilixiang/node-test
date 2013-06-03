
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')	
  , mongodb = require('mongodb')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , purchaseOrder = require('./routes/purchase_order')
  , sellOrder = require('./routes/sell_order')
  , company = require('./routes/company')  
  , repertory = require('./routes/repertory');
  

var app = express();
app.engine('html', require('ejs').renderFile);

app.configure(function(){
  app.set('port',80);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({
        uploadDir: __dirname + '/uploadfs'
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/admin.html', routes.admin);
app.get('/page.html', routes.page);
//company
app.post('/newcompany.node', company.newCompany);
app.get('/queryallcompany.node' , company.queryAll);
app.post('/query_paged_company.node' , company.pagedQuery);
app.post('/company_upload.node' , company.fileUploader);
//user
app.post('/newemployee.node' , user.newEmployee);
app.post('/queryalluser.node' , user.queryAll);
//purchase
app.post('/newpurchase.node' , purchaseOrder.newPurchase);
app.post('/purchase_upload.node', purchaseOrder.purchasefileUploader);
app.post('/query_purchase.node', purchaseOrder.queryPurchase);
app.post('/query_unpaied_purchase.node' , purchaseOrder.queryUnpaied);
app.get('/query_purchase_buyers.node' , purchaseOrder.findAllBuyer);


//sale
app.post('/newsell.node' , sellOrder.newSell);
app.post('/querysale.node' , sellOrder.query);
app.post('/query_unreceived_sale.node' , sellOrder.queryUnreceived);
app.post('/sale_statistic_upload.node' , sellOrder.saleFileUploader);
app.get('/query_sell_shipment_cmp.node' , sellOrder.queryShipmentCmp);

//app.get('/whocollect-gather/GatherServlet' , gather.log);

app.post('/repertory_upload.node' , repertory.repertoryFileUpload);
app.post('/query_repertory.node' , repertory.queryRepertory);


app.post('/query_ansell_glove_repertory.node' , repertory.queryAnsellGloveRepertory);
app.post('/ansell_glove_upload.node' , repertory.ansellGloveFileUpload);

app.post('/query_sample_repertory.node' , repertory.querySampleRepertory);
app.post('/sample_upload.node' , repertory.sampleFileUpload);


app.post('/query_seller_consume_record.node' , repertory.querySellerConsumeRecord);
app.post('/seller_consume_record_upload.node' , repertory.sellerConsumeRecordFileUpload);
var server = http.createServer(app); 
/**
server.on('request' , function(req , res) {
	 req.setEncoding('utf8');
});
**/
server.listen(app.get('port'), function(error){
  if(error) {
  	 console.error(error);
  } else {
	  console.log("Express server listening on port " + app.get('port'));
  }
});
