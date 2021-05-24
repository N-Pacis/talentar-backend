const jwt = require("jsonwebtoken")
const config = require("config")

exports.authenticate = (req,res,next)=>{
    const token = req.header('talentar-auth-token')
    if(!token) return res.status(401).send("Access Denied! You need to login first")
    try{
        let user = jwt.verify(token,config.get("JWT"))
        req.user = user
        next()
    }
    catch(ex){
        res.status(400).send("Invalid Token")
    }
}
