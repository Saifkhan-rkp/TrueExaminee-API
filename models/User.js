const { hashSync, compareSync } = require('bcryptjs');
//const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
const {dbCon} = require('../configuration');
const {userValidator,logSchema} = require('../validator');

class User{
    constructor(userData) {
        this.userData = {...userData};
    };

    save(cb) {
        dbCon('users',async (db)=>{
            try {
                const hashedPass = hashSync(this.userData['password'],12);
                this.userData['password'] = hashedPass;
                this.userData['verified'] = false;
                await db.insertOne(this.userData);
                cb();
            } catch (error) {
                cb(error);
            }
            
        });
    }

    checkExistence(){
        return new Promise((resolve, reject) => {
            
            dbCon('users', async (db)=>{
                try {
                    const user = await db.findOne({'$or':[{username: this.userData['username']},{email: this.userData['email']}]});

                    if (!user) {
                        resolve({
                            check : false
                        });
                    } else if(this.userData['username']=== user.username){
                        resolve({
                            check: true,
                            message : 'This username is already Exists'
                        })
                    } else if(this.userData['email']=== user.email){
                        resolve({
                            check: true,
                            message : 'This email is already registered'
                        })
                    }
                } catch (error) {
                    reject(error);
                }

            });
        })
    }

    static validate(userData){
        // const result = 
        //console.log(result.error.message);
        return userValidator.validate(userData);
        
    }

    static login(userData1){
        return new Promise((resolve,reject)=>{
            //validation
            const validation = logSchema.validate(userData1);
            if (validation.error) {
                const err = new Error(validation.error.message);
                err.statusCode = 400;
                return resolve(err);
            }

            dbCon('users',async(db)=>{
                try {
                    //find User
                    const user = await db.findOne({username: userData1['username']},{projecton:{username: 1, password: 1}});
                    //console.log(user);

                    if (!user || !compareSync(userData1['password'], user.password)) {
                        const error = new Error('Please enter valid username or Password');
                        error.statusCode =404;
                        return resolve(error);
                    }
                   // console.log(compareSync(userData['password'], user.password)); 
                    resolve(user);
                   // const check = 

                } catch (err) {
                    reject(err);
                }
            });
        });
    }
};



// User.login({              //{'$or':[{username: userData['username']},{email: userData['email']}]}
//     username :"kaka2",
//     password: "PaPa@1234"
// }).then(res =>{
//     console.log(res);
// });


module.exports = User;