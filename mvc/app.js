'use strict'

var express = require('express');
var logger = require('morgan');
var path = require('path');
var session = require('express-session');
var methodOverride = require('method-override');
var app = module.exports = express();
const port = 3000;

/*
    set our default template engine to "ejs"
    which prevents the need for using file exotensions
*/
app.set('view engine', 'ejs');

// set view for error and 404 pages
app.set('views', path.join(__dirname,'views'));

/*
    define a custom res.message() method
    which stores messages in the session
*/
app.response.message = function(msg){
    //reference 'req.session' via the 'this.req' reference
    console.log(app.response)
    var sess = this.req.session;
    
    //simply add the msg to an array for later
    sess.messages = sess.messages || [];
    sess.messages.push(msg);
    return this;
};

// log
app.use(logger('dev'));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

//session support
app.use((session({
    resave: false,  // don't save the session if modified
    saveUninitialized: false,   // don't create a session until something stored
    secret: 'some secret here'
})));

// parse request bodies (req.body)
app.use(express.urlencoded({extended: true}));

// allow overrding methods in query (?_method=put)
app.use(methodOverride('_method'));

// expose the "messages" local variable when views are rendered
app.use((req, res, next)=>{
    var msgs = req.session.messages || [];

    // expose "messages" local variable
    res.locals.messages = msgs;

    // expose "HasMessages"
    res.locals.hasMessages = !! msgs.length;

    /*
        This is equivalent:
        res.locals({
            messages: msgs,
            hasMessages: !! msgs.length
        })
    */

    next();

    /*
        empty or "flush" the messages so they
        don't build up
    */
   req.session.messages = [];
});

// load controllers
require('./lib/boot')(app,{verbose: true});

app.use((err, req, res, next)=>{
    // log it
    console.error(err.stack);

    // error page
    res.status(500).render('5xx');
});

// assume 404 since no middleware responded
app.use((req, res, next)=>{
    res.status(404).render('404', {url: req.originalUrl});
});

app.listen(port, ()=>{
    console.log('Running on port: '+port);
});