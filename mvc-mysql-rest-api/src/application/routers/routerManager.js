var route_api = require('./apiRouter');

module.exports = (app)=>{
    app.use('/api', route_api);
};