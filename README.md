nodejs-realtime-fb
==================

Facebook Real-time Updates integration for NodeJS.
You can read more about Facebook Real-time Updates API on https://developers.facebook.com/docs/reference/api/realtime/

The module is built on top of ExpressJS module and also uses 'querystring'.

It exposes 5 basic functions:
- startListening(ip, port, endpointUrl, facebook_app_id, facebook_app_secret, function(data){});
- subscribe(object, fields, function(err){});
- listSubscriptions(object, function(err){});
- unsubscribe(object, function(err){});
- stopListening();
