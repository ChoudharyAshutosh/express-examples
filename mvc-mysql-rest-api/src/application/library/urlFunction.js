var url = require('url');

module.exports.getUrlQuery = (req)=>{
    var url_parts = url.parse(req.url, true);
    var variables = url_parts.query;
    return variables;
}