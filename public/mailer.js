
const nodemailer = require('nodemailer');

/**
 * Sends a mail
 * @param {string} ngMail The ng mail
 * @param {string} ngMailPassword The ng mail password
 * @param {string} to The mail recipient
 * @param {string} subject The mail subject
 * @param {string} body  The mail body
 */
function sendMail(ngMail, ngMailPassword, to, subject, body) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, 
        auth: {
            type: "login",
            user: ngMail,
            pass: ngMailPassword
        }
    });

    var mailOptions = {
        from: ngMail,
        to: to,
        subject: subject,
        text: body
    };

    // The mail result handlers
    var handlers = {

    }

    // Try to send mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error:sendMail " + error);

            if(handlers.reject) {
                handlers.reject(error);
            }
            
        } else {
            console.log("success:sendMail " + info.response);
            
            if(handlers.resolve) {
                handlers.resolve(info.response);
            }
        }
    });

    // Return promise
    return new Promise((resolve, reject) => {
        handlers.resolve = resolve;
        handlers.reject = reject;
    });
}

module.exports = sendMail; 