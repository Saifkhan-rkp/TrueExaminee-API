const { Exam } = require("../models");
const createHttpError = require('http-errors');
const {ObjectId} =require('bson');

const examUpload = (req,res,next)=>{
    const err = Exam.validate(req.body);
    if (err) {
        //console.log('Error is here...',err);
        return next(err);
    }
    const edata = req.body;
    edata.userId = new ObjectId(req.user['_id']);
    console.log(req.user['_id']);
    edata.username = req.user['username'];
    //console.log("correct : ",edata);
    const exam = new Exam(edata);

    exam.save().then(() => {
        res.status(201).json({
            message : "New Exam Created..!"
        });
    }).catch((err) => 
        {
            const nerr = new Error(err);
            nerr.statusCode = 500;
            next(nerr);
        });
    
   
};
const editExam = (req,res,next)=>{
    const edata =new Object(req.body);
    const eId = new ObjectId(req.params.examId)
    if (!ObjectId.isValid(req.params.examId)) {
        return next(createHttpError(400));
    }
    const err = Exam.validate(edata);
    if (err) {
        //console.log('Error is here...',err);
        return next(err);
    }
    // const change = Exam.checkChange(edata, eId);
    // if(!change.change){
    //     res.json({message: 'no change'});
    //     return ;
    // }
    Exam.update(eId,edata).then(()=>{
        res.status(200).json({
            message: 'Updated Successfully..!'
        })
    }).catch(err => next(createHttpError(500)));
};
const deleteExam = (req,res,next)=>{

    const edata =new Object(req.body);
    if (!ObjectId.isValid(req.params.examId)) {
        return next(createHttpError(400));
    }

    const examId = new ObjectId(req.params.examId);

    const err = Comment.validate(edata);
    if (err) {
        return next(err);
    }

    Comment.delete(examId).then(()=>{
        res.json({
            messege : 'exam deleted..!'
        });
    }).catch(err => next(createHttpError(500)));
};


module.exports = {
    examUpload,
    editExam,
    deleteExam
};