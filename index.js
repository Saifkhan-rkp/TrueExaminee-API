require('dotenv').config();
const http = require('http');
const app = require('./app');

const serevr= http.createServer(app);

serevr.listen(process.env.PORT,()=>{
    console.log(`Server is On\n link http://localhost:${process.env.PORT}`);
});