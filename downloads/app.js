'use strict'

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// path to where files are stored on disk
const FILES_DIR = path.join(__dirname,'files');

app.get('/',(req, res)=>{
    res.send(
        '<ul>'+
        '<li> Download <a href="/files/notes/groceries.txt">notes/groceries</a>.</li>'+
        '<li> Download <a href="/files/amazing.txt">amaxing.txt</a>.</li>'+
        '<li> Download <a href="/files/missing.txt">missing.txt</a>.</li>'+
        '</ul>'
    )
});

/*
    /files/* are accessed via req.params[0]
    but here we name it :file
*/

app.get('/files/:file(*)',(req, res, next)=>{
    res.download(req.params.file, { root: FILES_DIR }, (err)=>{
        if(!err) return;
        if(err.status !== 404) return next(err);
        res.statusCode = 404;
        res.send("Can't find that file sorry!");
    });
});

app.listen(port, ()=>{
    console.log('Running on port: '+port);
});