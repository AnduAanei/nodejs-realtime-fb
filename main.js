var client = require(__dirname+"/lib/client.js");
var server = require(__dirname+"/lib/server.js");

exports.settings = {
    _host : "",
    _port : "",
    _endpointUrl : "",
    _facebookAppId : "",
    _facebookAppSecret : "",
    silent: false
}

exports.settings.__defineSetter__("host", function(h){
    if(h && h!=="" && h.indexOf(":")===-1){
        this._host = h;
    } else {
        throw "Facebook Real-time Updates Exception: Wrong 'host' paramter";
    }
});
exports.settings.__defineGetter__("host", function(){
    return this._host;
});

exports.settings.__defineGetter__("port", function(){
    return this._port;
});
exports.settings.__defineSetter__("port", function(p){
    if(p && (p!==0 || p!=="" )){
        this._port = p;
    } else {
        throw "Facebook Real-time Updates Exception: Wrong 'port' paramter";
    }
});

exports.settings.__defineSetter__("endpointUrl", function(e){
    if(e && e!==""){
        this._endpointUrl = e;
    }
    else {
        throw "Facebook Real-time Updates Exception: Wrong 'endpointUrl' paramter";
    }
});
exports.settings.__defineGetter__("endpointUrl", function(){
    return this._endpointUrl;
});

exports.settings.__defineSetter__("facebookAppId", function(i){
    if(i && i!==""){
        this._facebookAppId = i;
    } else {
        throw "Facebook Real-time Updates Exception: Wrong 'facebookAppId' paramter";
    }
});
exports.settings.__defineGetter__("facebookAppId", function(){
    return this._facebookAppId;
});

exports.settings.__defineSetter__("facebookAppSecret", function(s){
    if(s && s!==""){
        this._facebookAppSecret = s;
    } else {
        throw "Facebook Real-time Updates Exception: Wrong 'facebookAppSecret' paramter";
    }
});
exports.settings.__defineGetter__("facebookAppSecret", function(){
    return this._facebookAppSecret;
});



exports.subscribe = function(object, fields, callback){
    client.getFacebookSubscriptionAccessToken(exports.settings.facebookAppId, exports.settings.facebookAppSecret, function(err, accessToken){
        if(!err){
            client.facebookSubscribe(exports.settings.host, exports.settings.port, exports.settings.endpointUrl, exports.settings.facebookAppId, accessToken, object, fields, function(err, data){
                if(!err){
                    callback(null);
                    if(!exports.settings.silent) console.log("Facebook Real-time Updates: subscribed successfully");
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    });

}

exports.listSubscriptions = function(callback){
    client.getFacebookSubscriptionAccessToken(exports.settings.facebookAppId, exports.settings.facebookAppSecret, function(err, accessToken){
        if(!err){
            client.listSubscriptions(exports.settings.facebookAppId, accessToken, function(err,data){
                if(!err){
                    callback(null, data);
                } else {

                }
            });
        } else {
            callback(err);
        }
    });
}

exports.unsubscribe = function(object, callback){
    client.getFacebookSubscriptionAccessToken(exports.settings.facebookAppId, exports.settings.facebookAppSecret, function(err, accessToken){
        if(!err){
            client.facebookUnsubscribe(exports.settings.facebookAppId, accessToken, object, function(err,data){
                if(!err){
                    callback(null);
                    if(!exports.settings.silent) console.log("Facebook Real-time Updates: unsubscribed successfully");
                }
            });
        } else {
            callback(err);
        }
    });
}


exports.startListening = function(host, port, endpointUrl, facebookAppId, facebookAppSecret, silent, execFunc){
    exports.settings.host = host;
    exports.settings.port = port;
    exports.settings.endpointUrl = endpointUrl;
    exports.settings.facebookAppId = facebookAppId;
    exports.settings.facebookAppSecret = facebookAppSecret;
    exports.settings.silent = silent;
    server.initializeServer(exports.settings.endpointUrl, silent, execFunc);
    server.start(exports.settings.port);
    if(!silent) console.log("Facebook Real-time Updates Server listening on "+ exports.settings.port);
}

exports.stopListening = function(){
    server.stop();
    if(!silent) console.log("Facebook Real-time Updates Server stopped");
}


