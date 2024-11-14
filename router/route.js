const ROOT_URL = "/api";
const backup   = require("../router/routes/backup");

function route(app){

    function auth(req, res, next){
        if(req.headers.authorization){
          if(req.headers.authorization === process.env.API_KEY){
            next();
          }else{
            console.log(req.headers.authorization);
            console.log(process.env.API_KEY)
            console.log("Auth failed ...")
          res.status(404).send('Auth failed');
          }
        }else{
          console.log("Auth failed")
          res.status(404).send('Auth failed');
        }
    }

    app.use(auth)
    
    app.use(ROOT_URL , backup);

}

module.exports.Route = route