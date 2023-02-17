const createHttpError = require('http-errors');
const {User} =require('../../models');
const {email} = require('../../configuration');
const jwt = require('jsonwebtoken');
const {readFileSync} =require('fs');

const secretK = readFileSync('./private.key');

const postSignup = (req,res,next)=>{
    const validation = User.validate(req.body);
    if (validation.error) {
        const error = new Error(validation.error.message);
        error.statusCode= 400;
        return next(error);
    }
    //check Existence
    const user = new User(req.body);
    user.checkExistence().then(result =>{
        if (result.check) {
            const err = new Error(result.message);
            err.statusCode= 409;
            return next(err);
        }
        user.save((err)=>{
            if (err) {
                return next(createHttpError(500));
            }

            
            const token = jwt.sign({username:user.userData['username']},secretK,{
                expiresIn: '1h'
            });
            console.log('http://localhost:8000/auth/verify/',token);
            email(user.userData['email'],token);

            res.status(201).json({
                message: "User Signup Successfully..!"
            });
        });
    }).catch(err => next(createHttpError(500)));
    //console.log(req.body);
}

module.exports={
    postSignup
}