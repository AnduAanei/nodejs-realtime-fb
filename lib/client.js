var https = require("https");
var querystring = require("querystring");

exports.getFacebookSubscriptionAccessToken = function(facebookAppId, facebookAppSecret, callback){
    https.get({host:'graph.facebook.com',
            path:'/oauth/access_token?client_id='+facebookAppId+"&client_secret="+facebookAppSecret+"&grant_type=client_credentials"},
        function(res){
            var data = "";

            res.on('data', function(chunk){
                data += chunk;
            });

            res.on('end', function(){
                if(data.toString().indexOf("error")===-1){
                    callback(null, data.split("=")[1]);
                } else {
                    callback(data);
                }
            })

            res.on('error', function(e){
                callback(e.message);
            });
        });
}

exports.facebookSubscribe = function(ip, port, endpointUrl, facebookAppId, accessToken, object, fields, callback){
    var options = {
        host:"graph.facebook.com",
        port: 443,
        path: '/' + facebookAppId + '/subscriptions?access_token='+accessToken,
        method: 'POST'
    };

    var postData = querystring.stringify({
        "object":object,
        "fields":fields,
        "callback_url": ip+":"+port.toString()+endpointUrl, //change ip
        "verify_token": "ikickass"
    });

    var req = https.request(options, function(res){
        var data = "";
        res.on('data', function(chunk){
            data += chunk;
        });

        res.on('end', function(){
            if(data.indexOf("error")===-1){
                callback(null);
            } else {
                callback(data);
            }
        });

        res.on('error', function(e){
            callback(e.message, null);
        });
    });

    req.write(postData);
    req.end();
}

exports.listSubscriptions = function(facebookAppId, accessToken, callback){
    var options = {
        host:"graph.facebook.com",
        port: 443,
        path: '/'+ facebookAppId +'/subscriptions?access_token='+accessToken,
        method: 'GET'
    };

    var req = https.request(options, function(res){
        var data = "";
        res.on('data', function(chunk){
            data += chunk;
        });

        res.on('end', function(){
            if(data.indexOf("error")===-1)
                callback(null, data);
            else
                callback(data);
        });

        res.on('error', function(e){
            callback(e.message, null);
        });
    });
    req.end();
}

exports.facebookUnsubscribe = function(facebookAppId, accessToken, object, callback){
    var options = {
        host:"graph.facebook.com",
        port: 443,
        path: '/'+ facebookAppId +'/subscriptions?access_token='+accessToken,
        method: 'DELETE'
    };

    var req = https.request(options, function(res){
        var data = "";
        res.on('data', function(chunk){
            data += chunk;
        });

        res.on('end', function(){
            if(data.indexOf("error")===-1)
                callback(null, data);
            else
                callback(data);
        });

        res.on('error', function(e){
            callback(e.message, null);
        });
    });

    if(object){
        var postData = querystring.stringify({
            "object" : object
        });
        req.write(postData);
    }
    req.end();
}