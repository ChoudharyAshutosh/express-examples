var queryFunction = require('./queryFunction');

module.exports.getCountries = (variables, callback)=>{
    let query = 'SELECT * FROM country c '+whereBuilder(variables);
    queryFunction.customQuery(query,(err, result)=>{
        if(err){
            console.log(`Model: model, function: getCountries, query: ${query}`);
            throw err;
        }
        callback(result);
    });
};

module.exports.getCity = (variables, callback)=>{
    let query = 'SELECT c.Id city_id, u.id country_id, c.cityName, u.countryName, u.tr_TR, u.en_US FROM cities c INNER JOIN country u on u.Id = c.countryId '+whereBuilder(variables);
    queryFunction.customQuery(query, (err, result)=>{
        if(err){
            console.log(`Model: model, function: getCity, query: ${query}`);
            throw err;
        }
        callback(result);
    });
};

const whereBuilder = (variables)=>{
    var first = 0;
    var query = '';

    // select a specific id numbers
    if("id" in variables){
        if(first == 0){
            query += 'WHERE c.Id = '+variables.id;
            first = 1;
        }
        else{
            query += 'and c.Id = '+variables.id;
        }
    }

    // customization with county name
    if("country" in variables){
        if(first == 0){
            query += "WHERE u.countryName LIKE '%"+variables.country+"%'";
            first  = 1;
        }
        else{
            query += "and u.countryName LIKE '%"+variables.country+"%'";
        }
    }

    // limit the data
    if('limit' in variables){
        query += 'LIMIT '+variables.limit;
    }

    return query;
}