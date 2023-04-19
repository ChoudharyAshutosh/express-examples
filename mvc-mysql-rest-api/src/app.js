let http = require('http');
var fs = require('fs');
var path = require('path');
var parser = require('body-parser');
var express = require('express');
var app = express();
var port = 3000;

app.use(parser.urlencoded({extended: false}));
app.use(parser.json());

require('./application/routers/routerManager')(app);

app.listen(port,()=>{
    console.log('Running on port: '+port);
});