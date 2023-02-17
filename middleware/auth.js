const createHttpError = require("http-errors");
const jwt = require('jsonwebtoken');
const {readFileSync} = require('fs');

module.exports=(req,res,next)=>{
    if (!req.get('Authorization')) {
        console.log('im here..!');
        return next(createHttpError(401));
    }
    const token = req.get('Authorization').split(' ')[1];
    const secretK = readFileSync('./private.key');
    
    try {
        const decode = jwt.verify(token, secretK);
        req.user ={_id: decode._id, username: decode.username};
        next();
    } catch (err) {
        //console.log('im here 222',err);
        next(createHttpError(401));
    }
}