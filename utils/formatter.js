const mongoose = require("mongoose");
/**
 * @param status
 * @param message
 * @param data
 * @returns {{status:number, message:string,data:*}}
 */
exports.formatResult = ({
    status = 200,
    message = "ok",
    data
}) => {
    return ({
        status: status,
        message: message,
        data:data
    })
}
//validating mongoDb id function
exports.idIsValid=(id)=>mongoose.Types.ObjectId.isValid(id)