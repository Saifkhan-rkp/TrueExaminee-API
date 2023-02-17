const Joi = require('@hapi/joi');
//const { ObjectId } = require('bson');

const examSchema =Joi.object({
  subject_name : Joi.string().required(),
  start_date : Joi.date().iso().required(),
  end_date : Joi.date().iso().greater(Joi.ref('start_date')).required(),//.min(Joi.ref('start_date')) for less than or equal
  duration: Joi.number().required().min(0.1).max(5.0),
  code : Joi.string().required().min(9).max(9),
  quiz : Joi.array().items(Joi.object({
        // Object schema
    question : Joi.string().required().min(30).max(300),
    options : Joi.array().items(Joi.string()).required().min(2).max(5),
    answer_key : Joi.string().required()
  }).required()), //Array complete
  
});
module.exports = {examSchema};