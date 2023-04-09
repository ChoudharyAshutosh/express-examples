'use strict'

var db = require('../../db');

exports.name = 'pet';
exports.prefix = '/user/:user_id';

exports.create = (req, res, next)=>{
    var id = req.params.user_id;
    var user = db.users[id];
    var body = req.body;
    console.log(user)
    if(!user){
        return next('route');
    }

    var pet = { name: body.pet.name};
    pet.id = db.pets.push(pet) - 1;
    user.pets.push(pet);
    res.message('Added pet '+ body.pet.name);
    res.redirect('/user/' + id);
};