const multer = require("multer")

exports.uploadFile=(destination,mimeTypes)=>{
    const storage = multer.diskStorage({
        destination: function(req,file,cb){
            cb(null,`./${destination}/`);
        },
        filename: function(req,file,cb){
            cb(null,new Date().toISOString() + file.originalName)
        }
    })

    const fileFilter = (req,file,cb)=>{
        if(mimeTypes.join('\|\|')){
            cb(null,true)
        }
        else{
            cb(new Error("File Type is not supported"),false)
        }
    }

    const upload = multer({
        storage:storage,
        limits:{
            fileSize:1024 * 1024 * 5
        },
        fileFilter: fileFilter
    })
}
