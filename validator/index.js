const { examSchema } = require('./examValidator');
const {schema,logSchema}= require('./userValidator');

module.exports ={
    userValidator : schema,
    logSchema : logSchema,
    examSchema : examSchema
};