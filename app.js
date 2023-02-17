const express = require('express');
const { logger } = require('./configuration');
const createError = require('http-errors');
const bodyParser = require('body-parser');
//middlewere
const {middleware} = require('./middleware');
//routers
const routes = require('./routes');
//const { error } = require('winston');


const app = express();

process.on('unhandledRejection',(reason)=>{
    logger.error(reason);
    process.exit(1);
});

middleware(app);

routes(app);



app.use(bodyParser.json());
// app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next)=>{
    const error = createError(404);
    next(error);
});

app.use((error,req,res,next)=>{
    logger.error(error.message);
    console.log(error.message);
    res.statusCode = error.statusCode;
    res.json({
        message : error.message
    });
});

module.exports = app;