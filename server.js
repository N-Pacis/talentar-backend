const express = require("express")
const app = express()
const debug = require("debug")
const startupdebug = debug('app:startup')
const dbDebug = debug('app:db')
const dbErrors = debug('db:errors')
const error = debug('error')
const bodyParser = require('body-parser')
const config = require('config')
const mongoose = require('mongoose')

//calling the bodyParser middleware that help us receive form values from the forms
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(express.static("profileUploads"))

//calling the routes
app.use(require("./routes/user.route"))

//connecting to the database
let password = config.get("DATABASE_PASSWORD")
mongoose.connect(`mongodb+srv://talentar-backend-team:talentar12345@talentar-backend.m9eua.mongodb.net/talentarDatabase?retryWrites=true&w=majority`,{useCreateIndex:true,useNewUrlParser:true,useFindAndModify:false,useUnifiedTopology:true})
    .then(()=>{
        dbDebug("Connected to the database successfully...")
    })
    .catch(err =>{
        dbErrors("Failed to connect due to ",err)
        console.log(config.get("DATABASE_PASSWORD"))
    })

//listening to the port and checking if the PORT environment variable is set
if(!config.get("PORT")){
    error("FATAL ERROR: Connection to the port is not defined")
    process.exit(-1);
}
const port = process.env.PORT || config.get("PORT")
app.listen(port,()=>{
    startupdebug(`Listening on port ${port}`)
})

