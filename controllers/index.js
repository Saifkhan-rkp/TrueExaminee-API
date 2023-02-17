const {postSignup}= require('./auth/signup');
const {getLogin, postLogin} = require('./auth/login');
const {getVerify}=require('./auth/verification');
const {examUpload,editExam,deleteExam} = require('./examC');
const {getRequests,postRequest, myExams, startExam, getQue, postQue}=require('./requestsC');

module.exports = {
    getLogin,
    postSignup,
    postLogin,
    getVerify,
    examUpload,
    editExam,
    deleteExam,
    getRequests,
    postRequest,
    startExam,
    myExams,
    getQue,
    postQue
};