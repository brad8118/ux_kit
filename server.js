/*jslint node: true */
"use strict";

//var lessMiddleware = require('less-middleware');
var express = require('express');
var app = express();

// var vc = process.env.VCAP_SERVICES || '{"p-mysql":[{"name":"tedb","label":"p-mysql","tags":["mysql","mariadb"],"plan":"small","credentials":{"hostname":"169.118.96.60","port":3306,"name":"cf_23e71540_0f6d_4c4a_abee_fbb8794a393b","username":"tfTUM6D54bAqLpbY","password":"jzKl0sgQzcDqhwEw","uri":"mysql://tfTUM6D54bAqLpbY:jzKl0sgQzcDqhwEw@169.118.96.60:3306/cf_23e71540_0f6d_4c4a_abee_fbb8794a393b?reconnect=true","jdbcUrl":"jdbc:mysql://tfTUM6D54bAqLpbY:jzKl0sgQzcDqhwEw@169.118.96.60:3306/cf_23e71540_0f6d_4c4a_abee_fbb8794a393b"}}]}';
// var vcap_services = JSON.parse(vc);

// process.mysql = {
//     host: vcap_services['p-mysql'][0].credentials.hostname,
//     user: vcap_services['p-mysql'][0].credentials.username,
//     password: vcap_services['p-mysql'][0].credentials.password,
//     database: vcap_services['p-mysql'][0].credentials.name
// };

// Configuration
app.set('views', __dirname + '/views');
app.set('view options', { layout: true });
app.set('view engine', 'jade');
//app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/css',  express.static(__dirname + '/css'));
app.use('/bootstrap',  express.static(__dirname + '/bootstrap'));
app.use('/public',  express.static(__dirname + '/public'));
//require("./routes/controller.js")(app);

var port = process.env.PORT || 3000; //this is important - you must read the port env var

var webServer = app.listen(port, function() {
    console.log('Listening on port %d', webServer.address().port);
});