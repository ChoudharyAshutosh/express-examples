'use strict'

const express = require('express');
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

// custom log format
if(process.env.NODE_ENV !== 'test'){
    app.use(logger(':method :url'));
}

/*
    parses request cookies, populating req.cookies and
    req.signedCookies when the secret is passed,
    used for signing the cookies
*/

app.use(cookieParser('my secret here'));

// parses x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

app.get('/',(req, res)=>{
    if(req.cookies.remember){
        res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
    }
    else{
        res.send(
            '<form method="post">'+
            '<p>Check to '+
            '<label>'+
            '<input type="checkbox" name="remember"/>remember me'+
            '</label>'+
            '<input type="submit" value="Submit"/>'+
            '</p>'+
            '</form>'
        )
    }
});

app.get('/forget',(req, res)=>{
    res.clearCookie('remember');
    res.redirect('back');
});

app.post('/',(req, res)=>{
    var minute = 60000;
    if(req.body.remember){
        res.cookie('remember', 1, { maxAge: minute});
    }
    res.redirect('back');
})

app.listen(port, ()=>{
    console.log('Running on port: '+port);
})