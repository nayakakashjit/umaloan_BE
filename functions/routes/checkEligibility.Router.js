var express = require("express");
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
var router = express.Router();
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

router.use(cors());
let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.use(bodyParser.json());


router.get('/', function(req, res) {
    res.send('Hello Eligibility check Rout');
});


router.post('/send', cors(corsOptions), (req, res) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: "contact@umaloan.com", // must be Gmail
      pass: "mnbznqhsoxhxoujg",
    },
  });
  
  let maillist = ["contact@umaloan.com", "prafulkumar466@gmail.com"];
  
    let mailOptions = {
      from: 'contact@umaloan.com',
      to: maillist, // must be Gmail
      subject: "New Eligibility check Enquiry",
      html: `
      <h2>Hi</h2> </br>
      <h3>Please find the below details</h3> </br>
      <table style="width: 100%; border: none">
      <thead>
        <tr style="background-color: #000; color: #fff;">
        <th style="padding: 10px 0">Full Name</th>
        <th style="padding: 10px 0">E-mail</th>
        <th style="padding: 10px 0">Phone</th>
        <th style="padding: 10px 0">Net Salary</th>
        <th style="padding: 10px 0">Loan Amount</th>
        <th style="padding: 10px 0">Pan No</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <th style="text-align: center">${req.body.name}</th>
        <td style="text-align: center">${req.body.email}</td>
        <td style="text-align: center">${req.body.phone}</td>
        <td style="text-align: center">${req.body.salary}</td>
        <td style="text-align: center">${req.body.amount}</td>
        <td style="text-align: center">${req.body.pan}</td>
        </tr>
      </tbody>
      </table>
      </br>
      <h3>Thank You</h3>
              `,
    };
  
    let replyMailToUser = {
      from: "contact@umaloan.com",
      to: req.body.email,
      subject: `Thank you ${req.body.name}`,
      html: `
      <h3>Hi ${req.body.name}</h3>
      <h3>Thank you, we have received your info</h3> 
      <h3>A customer service representative will be in touch within 24 hours</h3> 
  
      </br></br></br>
      <h3>Thank You</h3></br>
      <h3>UMALOAN FINANCIAL SERVICES.</h3>
      <img src="https://umaloan.com/assets/images/Logo/logo.jpg" alt="umaloanLogo" width="190" height="45">
      `,
    };
  
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(400).json({
          message: "invalid request",
        });
      } else {
        console.log("Email sent: " + info.response);
        eventEmitter.emit("reply");
        res.status(200).json({
          message: "successfuly sent!",
        });
      }
    });

    eventEmitter.on("reply", function () {
      transporter.sendMail(replyMailToUser, (error, info) => {
        if (error) {
          console.log(error);
          res.status(400).json({
            message: "invalid request",
          });
        } else {
          console.log("Email sent to user: " + info.response);
          res.status(200).json({
            message: "successfuly sent!",
          });
        }
      });
    });
  
  });

  module.exports = router;