const express = require('express');
const app = express();
const port = 3000;

app.get('/',(req, res)=>{
    res.send('Hello World!.');
})

app.post('/',(req, res)=>{
    res.send('Got a POST request.');
})

app.put('/user',(req, res)=>{
    res.send('Got a PUT request.');
})

app.delete('/user',(req, res)=>{
    res.send('Got a DELETE request.')
})

app.listen(port,()=>{
    console.log('Running on port : '+port);
})