'use strict'
const express = require('express');
const hash = require('pbkdf2-password')();
const session = require('express-session');
const path = require('path');
const port = 3000;
const app = express();

//config
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(session({
    resave: false,              //don't save session if unmodified
    saveUninitialized: false,   //don't create session until something stored
    secret: 'shhh, very secret'
}));

//session-persisted message middleware
app.use((req, res, next)=>{
    var err = req.session.error;
    var msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if(err) res.locals.message = '<p class="msg error">'+err+'</p>';
    if(msg) res.locals.message = '<p class="msg success">'+msg+'</p>';
    next();
});

//dummy database
var users = {
    tj: {
        name : "tj",
    }
}

//when you create a user,  generate a salt
//and hash the password ('foobar' is the pass here)
hash({ password: 'foobar'},(err, pass, salt, hash)=>{
    if(err) throw err;
    //store the hash and salt in db
    users.tj.salt = salt;
    users.tj.hash = hash;
})

//Authenticate using our plain-objects of doom!
const authenticate = (name, pass, fn)=>{
    console.log('authenticating %s:%s', name, pass);
    var user = users[name];
    //query the database for the given username
    if(!user) return fn(null,null);
    //apply the same algorithm to the POSTed password, applying
    //the hash against the pass/salt, if there is a match found the user
    hash({ password: pass, salt: user.salt},(err, pass, salt, hash)=>{
        if(err) return fn(err);
        if(hash == user.hash) return fn(null, user);
       fn(null,null);
    })
}

const restrict = (req, res, next)=>{
    if(req.session.user){
        next();
    }
    else{
        req.session.error = 'Access denied';
        res.redirect('/login');
    }
}

app.get('/', (req, res)=>{
    res.redirect('/login');
});

app.get('/restricted', restrict, (req, res)=>{
    res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', (req, res)=>{
    //destroy the user's session to log them out
    //will be re-created next request
    req.session.destroy(()=>{
        res.redirect('/');
    });
});

app.get('/login',(req, res)=>{
    res.render('login');
});

app.post('/login',(req, res, next)=>{
    authenticate(req.body.username, req.body.password,(err, user)=>{
        if(err) return next(err);
        if(user){
            //regenerate session when signing in to prevent fixation
            req.session.regenerate(()=>{
                //store the user's primary key in the session store to be retrieved
                //or in this the entire user object
                req.session.user = user;
                req.session.success = 'Authenticated as '+user.name+
                ' click to <a href="/logout">logout</a>.'+
                ' You may now access <a href="/restricted">/restricted/</a>.';
                res.redirect('back');
            });
        }
        else{
            req.session.error = 'Authentication failed, please check your'+
            ' username and password.'+
            ' (use "tj" and "foobar")';
            res.redirect('/login');
        }
    });
});

app.listen(port,()=>{
    console.log('Running on localhost:'+port);
})