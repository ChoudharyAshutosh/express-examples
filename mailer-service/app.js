const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

var jsonParser = bodyParser.json();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sender@gmail.com',
        pass: 'senderNodeMailerPassword'
    }
});

app.all('/mail', jsonParser,(req, res, next)=>{
    let data = req.body;
    console.log(data)
    if(data.key=='@authKey'){
        var mailOptions = {
            from: 'sender@gmail.com',
            to: data.to,
            subject: data.subject,
            text: data.body,
        }

        transporter.sendMail(mailOptions,(err, info)=>{
            if(err){
                console.log(err);
                res.json({
                    status: 500,
                    msg: 'Internal error'
                });
            }
            else{
                console.log('Email sent: '+info.response);
                res.json({
                    status: 200,
                    msg: 'Mail sent sucessfully'
                });
            }
        })
    }
    else{
        res.json({
            status: 401,
            msg: 'Unauthorised access'
        });
    }
});

app.use((req, res)=>{
    res.json({
        status: 404,
        msg: 'Resource not found'
    });
});

app.listen(port,()=>{
    console.log(`Running on port: ${port}.`);
});