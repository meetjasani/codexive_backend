import nodemailer from "nodemailer";
import EmailTemplates from "swig-email-templates";
var sgTransport = require('nodemailer-sendgrid-transport');
import dotenv from "dotenv";
const fs = require('fs');
dotenv.config();

const templates = new EmailTemplates({
  root: "src/templates"
});


export const sendEmailHelper = (email, subjectName, link) => {
  return new Promise(async (resolve, reject) => {

    templates.render("email.html", { email, link }, async (err, html, text, subject) => {
      try {

        var options = {
          auth: {
            api_key: process.env.SENDGRID_API_KEY
          }
        }

        const Option = nodemailer.createTransport(sgTransport(options))

        let mailDetails = {
          from: process.env.SMTP_USER_NAME,
          to: email,
          subject: subjectName,
          html: html,
          text: text,

          attachments: [{
            filename: 'image.png',
            content: Buffer.from(
              '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',
              'base64'
            ),
            cid: 'myimagecid'
          }]
        };

        let info = Option
          .sendMail(mailDetails)
        resolve(info);
        resolve(info);
      } catch (err) {
        reject(err);
      }
    });
  });
};
