const {Router}= require('express');
const {myExams,postRequest,startExam, getQue, postQue} = require('../controllers');
const {auth}=require('../middleware');


const router = Router();

router
.get('/myExams', auth, myExams)
.get('/startExam/:eCode',auth,startExam)
.get('/startExam/que/:rCode',auth, getQue)
.post('/:eCode', auth, postRequest)
.post('/startExam/que/:rCode',auth, postQue);

module.exports = router;