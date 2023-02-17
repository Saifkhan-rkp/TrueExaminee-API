const {Router}= require('express');
const {examUpload, editExam, deleteExam, getRequests} = require('../controllers');
const {auth}=require('../middleware');

const router = Router();

router
.post('/examUpload',auth, examUpload)
.put('/editExam/:examId', auth, editExam)
.delete('deleteExam/:examId', auth, deleteExam)
.get('/editExam/:examId/requests/:page', auth, getRequests);
//
module.exports = router;
