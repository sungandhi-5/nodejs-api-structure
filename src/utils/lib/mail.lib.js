var nodemailer = require('nodemailer');
const General = require('./general.lib')
const { error_log, silly_log, debug_log, log } = require("../lib/log.lib");
var fs = require('fs');

require("dotenv").config();

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendMail = async (mailOptions) => {
    transport.sendMail(mailOptions, async function (error, info) {
      if (typeof mailOptions.attachments !== 'undefined' && mailOptions.attachments.length >= 1) {
        for (let i = 0; i < mailOptions.attachments.length; i++) {
          let attachment = mailOptions.attachments[i];
          if(attachment.path){
            silly_log('attachment path: ', attachment.path);
            fs.unlink(attachment.path, function (err) {
              if (err) return err;
              silly_log('file deleted successfully');
            });
          }
        }
      }
      if (error) {
        error_log(["Email error: ", error]);
        error_log(["Email error message: ", error.message]);
        return General.error_res(error.message);
      } else {
        debug_log("Email sent successfull",info.response);
        return General.success_res("mail send successfull.");
      }
    });
  }  

module.exports = {
    sendMail,
};