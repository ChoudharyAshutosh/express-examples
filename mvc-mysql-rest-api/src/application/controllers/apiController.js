var model = require('../models/model');
var urlFunctions = require('../library/urlFunction');

module.exports.getCountries = (req, res)=>{
    var variables = urlFunctions.getUrlQuery(req);
    model.getCountries(variables,(result)=>{
        res.json(result);
    });
};

module.exports.getCity = (req, res)=>{
    var variables = urlFunctions.getUrlQuery(req);
    model.getCity(variables, (result)=>{
        res.json(result);
    });
};

