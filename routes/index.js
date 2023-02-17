const authRouter = require('./auth');
const examRouter = require('./exam');
const reqRouter = require('./request');

module.exports = (app)=>{
    app.use('/auth',authRouter);
    app.use('/exam',examRouter);
    app.use('/request',reqRouter);
};
