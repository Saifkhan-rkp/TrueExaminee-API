const {dbCon}=require('../configuration');
class Request{
    constructor(rData) {
        this.rData = rData;
        this.rData.requestedAt = new Date();
    }
    save(){
        return new Promise((res,rej)=>{
            dbCon('request',async (db)=>{
               try {
                   const come = await db.insertOne(this.rData);
                   res();
               } catch (err) {
                   // console.log('im here..!',err);true_Examinee.request
                   rej(err);
               }
            });
        });
    }
    static edit(reqId ){
        return new Promise((res,rej)=>{
            dbCon('request',async (db,db2)=>{
               try {
                   const request = await db.findOneAndUpdate({_id:reqId},{'$set':{allowed: true}});
                   //console.log(request.value['examId']);
                   //console.log("undefined form here :",request.examId);
                   await db2.updateOne({_id: request.value['examId']},{
                       '$push':{
                           enrolled:{
                               '$each':[{userId:request.value.userId,allowed:request.value.allowed}],
                               '$slice': -10
                           }
                       }
                   });
                   //const come = await db.findOne({movie_id});
                   res();
               } catch (err) {
                   // console.log('im here..!',err);
                   rej(err);
               }
            },'exam');
        });
    }
    static delete(reqId){
        return new Promise((res,rej)=>{
            dbCon('request',async (db)=>{
                try {
                    //console.log(commentId);
                    const check = await db.deleteOne({_id:reqId});
                    //console.log(check);
                    res();
                } catch (err) {
                    rej(err);
                }
            });
        });
    }
    checkExistence(userId,eId){
        return new Promise((resolve, reject) => {
            
            dbCon('request', async (db)=>{
                try {
                    const reuest = await db.findOne({$and:[{userId:userId},{examId:eId}]});

                    if (!reuest) {
                        resolve({
                            check : false
                        });
                    } else{
                        resolve({
                            check: true,
                            message : 'You already Requested for This Exam'
                        })
                    } 
                } catch (error) {
                    reject(error);
                }

            });
        })
    }
}
module.exports = Request;


//await db2 .updateOne({_id: this.rData['examId']},{
//     '$push':{
//         requests:{
//             '$each':[{_id:this.rData['id'],username:this.rData['username'],allowed:this.rData['allowed']}],
//             '$slice': -10
//         }
//     }
// }
/**
 * else if(this.rData['email']=== reuest.email){
                        resolve({
                            check: true,
                            message : 'This email is already registered'
                        })
                    }
 */