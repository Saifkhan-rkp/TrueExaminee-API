const { ObjectId } = require("bson");
const { dbCon } = require("../configuration");
const { examSchema } = require("../validator");
//const {ObjectId} =require('bson');
//const { object } = require("@hapi/joi");

class Exam {
    constructor(examData) {
        this.examData = {...examData};
        this.examData.createdAt = new Date();
        this.examData.modifiedAt = new Date();
    }
    static validate(data){
        const val = examSchema.validate(data);
        if (val.error) {
            const err = new Error(val.error.message);
            err.statusCode= 400;
            return err;
        }
        return null;
    }
    static checkExistence(eId){
        return new Promise((resolve, reject) => {
            dbCon('exam', async (db)=>{
                try {
                    const exam = await db.findOne({_id:eId});
                    if (exam) {
                        resolve({
                            check: true,
                            sub_name: exam.subject_name
                        });
                    }else{
                        resolve({
                            check: false
                        });
                    }
                }catch(err){
                    reject(err);
                }
            });
        });
    }
    save(){
        return new Promise((res,rej)=>{
            dbCon('exam',async (db)=>{
                    try {
                        //console.log(this.examData);
                        const result = await db.insertOne(this.examData);
                        //console.log(result.insertedId);
                        res();
                    } catch (err) {
                        rej(err);
                    }
                }
            )
        });
    }
    readExam(examId){
        return new Promise((res,rej)=>{
            dbCon('exam',async (db) =>{
                try {
                    const exam = await db.findOne({_id: examId});
                    if (!exam) {
                        rej();
                    }
                    res(exam);
                } catch (error) {
                    rej(err);
                }
            });
        });
    }
    
    static update(examId,upData){
        return new Promise((res,rej)=>{
            dbCon('exam',async(db)=>{
                try {
                    await db.updateOne({_id:examId},{'$set':upData,'$currentDate':{modifiedAt:true}});
                    res();
                } catch (err) {
                    rej(err);
                }
            });
        });
    }
    static delete(examId){
        return new Promise((res,rej)=>{
            dbCon('exam',async (db)=>{
                try {
                    //console.log(commentId);
                    const check = await db.deleteOne({_id:examId});
                    //console.log(check);
                    res();
                } catch (err) {
                    rej(err);
                }
            });
        });
    }

}


module.exports = Exam;