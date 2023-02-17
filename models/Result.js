const { ObjectId } = require("bson");
const { dbCon } = require("../configuration");
const { localTime } = require("../configuration/extraFunctions");

class Result{

    constructor(result) {
        this.result = result;
        this.result.last_edit = localTime(new Date());
    }
    static save(resObj){
        resObj.last_edit =new Date();
        return new Promise((res,rej)=>{
            dbCon('result',async (db)=>{
                try {
                    const come = await db.insertOne(resObj);
                    res({
                        message:'congratulations..!',
                        insertedId :come.insertedId
                    });
                } catch (err) {
                rej(err);
                }
            });
            
        });
    }
    static edit(rId,uId,update){
        console.log(update);
        return new Promise((res,rej)=>{
            try {
                dbCon('result',async (db)=>{
                    const available = await db.updateOne(
                        {_id:rId,userId:uId, quiz:{$elemMatch:{question:update.question}}},
                        {
                            $set: { 'quiz.$.answer' : update.answer }
                        }
                    );
                    //console.log(available.modifiedCount);
                    if (!available.matchedCount) {
                        res({message:'Not Matched..!'});
                    }else{
                        res({message:"Done"});
                    }
                    
                });
            } catch (err) {
                rej(err);
            }
        });
    }
    static checkExistance(uId,eId){
        return new Promise((res,rej)=>{
            dbCon('result',async (db)=>{
                try {
                    const available = await db.findOne({'$and':[{examId: eId},{userId :uId}]});

                    if (!available) {
                        res({
                            check:false
                        });
                    }else{
                        res({
                            check:true,
                            rCode: available._id
                        });
                    }
                    // res(available);
                } catch (err) {
                    //console.log(err);
                    rej(err);
                }
            });
           

        });
    }
    static checkStatus(rId,userId,qNO){
        return new Promise((res,rej)=>{
            try {
                dbCon('result',async (db)=>{
                    const available = await db.findOne({_id:rId,userId},
                        {projection:
                            {
                                status:1,
                                duration:1,
                                alloted_time:1,
                                quiz:{ $arrayElemAt: [ "$quiz", qNO ] }
                            }
                        });
                    //console.log(available);
                    if (!available) {
                        res({
                            check:false,
                            status:'Not Found'
                        });
                    }else{
                        available.check= true;
                        res(available);
                    }
                });
            } catch (err) {
                rej(err);
            }
        });
    }
    static calculateResult(eId,uId){
        return new Promise((res,rej)=>{
            dbCon('exam',async (db)=>{
                try {
                    db.updateOne({_id:eId,userId:uId},{})
                } catch (err) {
                    rej(err);
                }
            });
        });
    }
}

// console.log(process.env.PORT);
// Result.checkExistance(new ObjectId('617e95917b1539591262a56d'),new ObjectId('6190bbd32c8311d0937f284a')).then(result=>{
//     console.log(result);
// }).catch(err=>{
//     console.log(err);
// });
module.exports = Result;

/**
 * '$push':{
                            ans_quiz: {
                                '$each':[update]
                            }
 */