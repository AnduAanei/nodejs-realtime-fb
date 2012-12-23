var express = require("express");
var url = require('url');

if(parseInt(express.version[0], 10)>=3)
    var server = express();
else
    var server = express.createServer();

exports.initializeServer = function(endpointUrl, silent, func){
    server.configure(function(){
        server.use(express.bodyParser());
        if(!silent) server.use(express.logger());
    });

    server.get(endpointUrl, function(req, res){
        var url_parts = url.parse(req.url,true);
        var query = url_parts.query;
        if(query.hasOwnProperty('hub.verify_token')){
            if(query['hub.verify_token']==="ikickass"){
                res.send(query['hub.challenge']);
            }
        } //should catch something here
    });

    server.post(endpointUrl, function(req, res){
        if(func !== undefined){
            var body = JSON.parse(JSON.stringify(req.body));
            func(body);
        }
    });
}

exports.start = function(port){
    server.listen(port);
}

exports.stop = function(){
    server.close();
}