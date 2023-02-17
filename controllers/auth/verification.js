const jwt = require('jsonwebtoken');
const {readFileSync} = require('fs');
const createHttpError = require('http-errors');
const {dbCon} = require('../../configuration');
const secretK = readFileSync('./private.key');

const getVerify =(req,res,next)=>{
    const token = req.query['token'];
    try {
        const decoded = jwt.verify(token,secretK);
        dbCon('users', async (db) =>{
           
            const modifiedDoc = await db.updateOne({username: decoded['username']},{'$set':{ verified : true}});
            if (modifiedDoc.modifiedCount === 0) {
                return next(createHttpError(404));
            }
            res.json({
                message : 'your account has been verified..!'
            })
        });
        
    } catch (err) {
      next(createHttpError(400));  
    }
};

module.exports = {
    getVerify
}