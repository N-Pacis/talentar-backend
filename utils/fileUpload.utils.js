const multer = require("multer")

exports.uploadFile=(destination)=>{
    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,`./profileUploads/`);
        },
        filename: function(req,file,cb){
            let date = Math.random() * 10000 
            cb(null,date + file.originalname)
        }
    })

    const fileFilter = (req,file,cb)=>{
        if(file.mimetype==='image/jpeg' ||file.mimetype==='image/jpg' || file.mimetype==='image/png'){
            cb(null,true)
        }
        else{
            cb("File Type not supported",false)
            console.log(file)
        }
    }

    const upload = multer({
        storage:storage,
        limits:{
            fileSize:1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })
    return upload
}
