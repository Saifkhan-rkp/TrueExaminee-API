const nodemailer = require('nodemailer');

const singnUpEmail = (email)=>{};
// const 

module.exports = (email, token) =>{
    //let testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
        service: 'gamil',
        // host: 'smtp.protonmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_EMAIL_PASSWORD
        }
    });
    let mailOptions = {
        from: 'SSSPL Pvt. Ltd.',
        to: email,
        subject: 'Email SignUp Verification',
        // text: 'This email is sent using Node js with nodemailer. Sender: Nguyen Duc Hoang',
        html: `<h1>Welcome !</h1>
        <p>To complete the Signup Process for TrueExaminee App Click the Link below. </p><br>
        <button><a href='http://localhost:${process.env.PORT}/auth/verify?token=${token}'>click here</a></button>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
//  https://www.youtube.com/watch?v=BfrJxGQEPSc&t=16105s
//  https://www.youtube.com/watch?v=lBRnLXwjLw0&t=0s

/**
 * readJsonFile: (jsonFileName) => {
        return readFile(jsonFileName, 'utf8').then((response) => {
            return JSON.parse(response);
        });
    } 
 */

    
/*
fileManager.buyAnIphone("iphone 7 plus").then((response) => {
    console.log(response);
}).catch((error) => {
    console.log(`${error}`);
});
*/
// readJsonFile('./src/jsonfile.json').then((jsonObject) => {
//     console.log(`email list = ${jsonObject["emails"]}`);
// });
