const Joi = require('@hapi/joi');
const { ObjectId } = require('bson');
const createHttpError = require('http-errors');
const {dbCon, shuffled_array, localTime} = require('../configuration');
const { Request, Exam, Result } = require('../models');

const status = ['waiting','ongoing','expired','Not Allowed'];

const getRequests = (req,res,next)=>{
    const pageNo =parseInt(req.params.page);
    if (isNaN(pageNo)) {
       return next(createHttpError(404));
    }
    if (!ObjectId.isValid(req.params.examId)) {
        return next(createHttpError(400));
    }
    const acceptReq = req.query.allowed;
    const reqId = req.query.id;
    //console.log(reqId,"  : ",acceptReq);
    //Accept Request If condition
    if (acceptReq ==='true' && reqId) {
        if (ObjectId.isValid(reqId)) {
            Request.edit(new ObjectId(reqId)).then(()=>{
                // res.json({
                //     messege : 'Request edited Successfully'
                // });
            }).catch(err => {
                console.log(err);
                next(createHttpError(500));});
        }else{        
            next(createHttpError(400));
        }
    }else{
        console.log("im here ur req is not updated");
    }
    const requestsToSkip = (pageNo-1) * 10;

   dbCon('request',async (db) =>{
       try {
            const requests = await db.find({examId:new ObjectId(req.params.examId)},{projection:{username:1, full_name: 1, allowed: 1,requestedAt:1}})
            .skip(requestsToSkip).limit(10).toArray();
            res.json(requests);
       } catch (error) {
        next(createHttpError(500));
       }
        
   });
};

const postRequest =(req,res,next)=>{
    const  userId =new ObjectId(req.user['_id']);
    const eCode = req.params.eCode.toString();
    const fName = Joi.string().min(5).max(30).validate(req.body['full_name']);
    if (!ObjectId.isValid(eCode) && !fName) {
        next(createHttpError(400));
    }
    Exam.checkExistence(new ObjectId(eCode)).then(check=>{
        if (check.check) {
            const rData = new Object({
                userId: userId,
                username:req.user.username,
                full_name: req.body['full_name'], 
                examId:new ObjectId(eCode),
                subject_name:check.sub_name, 
                allowed : false
            });
            const reqq = new Request(rData);
            reqq.checkExistence(rData.userId,rData.examId).then(result =>{
                if (result.check) {
                    const err = new Error(result.message);
                    err.statusCode= 409;
                    return next(err);
                }
                reqq.save().then(() => {
                    res.status(201).json({
                        message : "Requested Successfully..!"
                    });
                }).catch(err => next(createHttpError(500)));
            }).catch(err => {
                const nerr = new Error(err);
                nerr.statusCode = 500;
                next(nerr);
            });   
        }else{
            next(createHttpError(400));
        }
    });
    
};

const myExams =(req,res,next)=>{
    const userId = req.user._id;
    // let enrolledExams;
    console.log(userId);
    //console.log(new Date());
    dbCon('exam',async (db)=>{
        try {
            const enrolledExams = await db.find({enrolled:{'$elemMatch':{userId:new ObjectId(userId),allowed:false}}},
            {projection:{
                subject_name:1,
                start_date:1,
                end_date:1,
                duration:1,
                que_count: {$size: "$quiz"},
                exam_status:{$cond:{
                    if:{$lt:[new Date(),new Date("$start_date")]},
                    then:status[0],
                    else:{
                        $cond:{
                            if:{$lt:[new Date(),new Date("$end_date")]},
                            then: status[1],
                            else:status[2]
                        }
                    }
                }}

            }}).toArray();
            console.log(enrolledExams);
            res.json(enrolledExams);
            //console.log(exId);
        } catch (err) {
            //console.log(err);
            const error= new Error(err);
            error.statusCode=500;
            next(error);
        }
        
    });
};

const startExam =(req,res,next)=>{
    const query = req.query.startExam;
    const uId = req.user._id;
    const eId = req.params.eCode;
    let examPre;
    if (query === 'true' && ObjectId.isValid(eId)) {
        dbCon('exam',async (db)=>{
            try {
                examPre =await db.findOne({_id:new ObjectId(eId)},
                {projection:{
                    subject_name:1,
                    duration:1,
                    count: {$size: "$quiz"},
                    quiz:{
                        $cond:{
                            if:{$and:[{$gt:[localTime(new Date()),"$start_date"]},{$lt:[localTime(new Date()),"$end_date"]}]},
                            then:"$quiz",
                            else:status[3]
                        }
                    }
                }});
                //console.log(uId);
                //console.log(examPre.quiz);
                Result.checkExistance(new ObjectId(uId),new ObjectId(eId)).then((result)=>{
                    console.log(result.check,'check');
                    if (!result.check) {
                        console.log(examPre.quiz!=status[3]);
                        if (examPre.quiz!=status[3]) {
                            const shuf_ary= shuffled_array(examPre.quiz);
                            shuf_ary.forEach(element => {
                                delete element.answer_key;
                            });
                            console.log(shuf_ary);
                            const temp_result = examPre;
                            delete temp_result._id;
                            //delete temp_result.duration;
                            temp_result.examId= new ObjectId(eId);
                            temp_result.userId = new ObjectId(uId);
                            temp_result.quiz = shuf_ary;
                            temp_result.created_date = localTime(new Date());
                            temp_result.status =status[0];
                            Result.save(temp_result).then(result=>{
                                console.log(result);
                                examPre.resultId = result.insertedId;
                                res.status(201).json(examPre);
                            })
                            .catch(err => next(createHttpError(500)));
                        }
                    }
                    if (result.check) {
                        console.log(result);
                        res.json({redirect:`http:localhost:8000/request/startExam/que/${result.rCode.toString()}?num=1`}
                        );
                    }
                }).catch(err => next(createHttpError(500)));
            } catch (err) {
                console.log(new Error(err));
                next(createHttpError(500));
            }
        });
    }else{
        console.log(' im here in else');
        next(createHttpError(400));
    }
    //res.json(examPre);
    
};
 
const getQue =(req,res,next)=>{
    const qNO = parseInt(req.query.num);
    const uId = req.user._id;
    const rId = req.params.rCode;
    if (isNaN(qNO) && !ObjectId.isValid(rId)) {
        next(createHttpError(400));
    }
    //console.log(uId);
    //console.log(new ObjectId(uId));
    Result.checkStatus(new ObjectId(rId),new ObjectId(uId),qNO-1)
    .then(result=>{
        //console.log(result.check);
        if (result.status==status[0]) {
            const alloted_time = localTime(new Date(),result.duration);
            dbCon('result',async(db)=>{
                try {
                    await db.updateOne({_id:new ObjectId(rId)},{'$set':{status:status[1],alloted_time:alloted_time}})
                } catch (err) {
                    console.log(err);
                    next(createHttpError(500));
                }
            });
            res.json({
                status: status[1],
                quiz: result.quiz
            });
        }
        if (result.status==status[1]){
            res.json(result.quiz);
        }
        if (!result.check) {
            res.status(400).json({ message: " go back and Start Exam again"});
        }
    })
    .catch(err=> next(createHttpError(500)));

};

const postQue =(req,res,next)=>{
    const rId = req.params.rCode;                                                
    const reqBody = req.body;
    const qNO = parseInt(req.params.num);
    const uId = new ObjectId(req.user._id);
    if (!ObjectId.isValid(rId) && isNaN(num)) {
        next(createHttpError(400));
    }
    Result.checkStatus(new ObjectId(rId),uId).then(result=>{
        if (!result.check) {
            res.status(400).json({
                status:result.status,
                message: "Start From Start Exam otherwies this may ban you..!"
            });
        }
        if (result.status===status[1]) {
            if (new Date()<result.alloted_time) {
                Result.edit(new ObjectId(rId),uId,reqBody).then(result1=>{
                    result.saved_status = result1.message;
                    res.json(result);
                }).catch(err => next(createHttpError(500)));
            }
            if (new Date()>=result.alloted_time){
                dbCon('result',async (db)=>{
                    try {
                        await db.updateOne({_id:new ObjectId(rId)},{'$set':{status:status[2]}})
                    } catch (err) {
                        //console.log(err);
                        next(createHttpError(500));
                    }
                });
                res.json({message:"Times Up..!"});
            }
        }
        if (result.status===status[2]) {
            res.json({message:"Times Up..!"});
        }
    }).catch(err =>{createHttpError(500)});

};
module.exports = {getRequests, postRequest, startExam, myExams, getQue, postQue};

/**
 * {enrolled:{'$elemMatch':{userId:new ObjectId(userId),allowed:false}}},{projection:{
                subject_name:1,
                start_date:1,
                end_date:1,
                duration:1

            }}
            $cond:{
                            $and:[{$gt:[new Date(),new Date("$start_date")]},{$lt:[new Date(),new Date("$end_date")]}],1,0
                        }
                         if (ObjectId.isValid(eId)) {
        dbCon('exam',async (db)=>{
            try {
                examPre =await db.findOne({_id:new ObjectId(eId)},
                {projection:{
                    
                    count: {$size: "$quiz"},
                    quiz:{
                        $cond:{
                            if:{$and:[{$gt:[localTime(new Date()),"$start_date"]},{$lt:[localTime(new Date()),"$end_date"]}]},
                            then:"$quiz",
                            else:status[0]
                        }
                    }
                }});
                
                    
                console.log(typeof(examPre.count));
                if (typeof examPre.count === 'number') {
                    const shuf_ary= shuffled_array(examPre.count);
                    const oneQue = examPre.quiz[shuf_ary[qNO-1]];
                    console.log(oneQue);
                    res.json(oneQue);
                }
                else{
                    console.log('im here.. chu');
                }
            } catch (err) {
                next(createHttpError(500));
            }
        });
        
    }else{
        next(createHttpError(400));
    }

    
    
 */