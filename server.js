const express = require("express")
const app = express()
const debug = require("debug")
const startupdebug = debug('app:startup')
const dbDebug = debug('app:db')
const dbErrors = debug('db:errors')
const error = debug('error')
const bodyParser = require('body-parser')
const config = require('config')

//calling the bodyParser middleware that help us receive form values from the forms
app.use(bodyParser.urlencoded({extended:true}))

//listening to the port and checking if the PORT environment variable is set
if(!config.get("PORT")){
    error("FATAL ERROR: Connection to the port is not defined")
    process.exit(-1);
}
const port = process.env.PORT || config.get("PORT")
app.listen(port,()=>{
    startupdebug(`Listening on port ${port}`)
})

