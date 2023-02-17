const { Request, Exam, Result } = require('../models');
const { ObjectId } = require('bson');
const createHttpError = require('http-errors');
const {dbCon} = require('../configuration');

const oneResult = (req,res,next)=>{
    const userId = new ObjectId(req.user._id);

};