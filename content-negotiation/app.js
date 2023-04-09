'use strict'

const express = require('express');
const app = express();
const users = require('./db');
const port  = 3000;

/*
    so either you can deal with any types of formatting
    for expected response in app.js 
*/

app.get('/', (req, res)=>{
    res.format({
        html : ()=>{
            res.send(
                '<ul>'+
                users.map((user)=>{
                    return `<li>${user.name}</li>`;
                }).join('')+
                '</ul>'
            );
        },
        text : ()=>{
            res.send(users.map((user)=>{
                return `- ${user.name} \n`;
            }).join(''));
        },
        json : ()=>{
            res.json(users);
        }
    })
})

/*
    or you can write a tiny middleware like this to add a layer
    of abtraction and make things a bit more declarative:
*/

const format = (path)=>{
    let obj = require(path);
    return (req, res)=>{
        res.format(obj);
    }
}

app.get('/users', format('./users'));

app.listen(port, ()=>{
    console.log('Running on port: '+port);
})
