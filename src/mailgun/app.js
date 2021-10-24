// var api_key = "be6379f3175ceb064f790a4aa9388c55-2bf328a5-88e9c7f3";
// var domain = "sandboxd8bf001ce70045878318f420142403e9.mailgun.org";
// var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

// export const emailMessage = (email, name, title, description) => {
//   var data = {
//     from: "szymon <sz.rojek@gmail.com>",
//     to: `<${email}>`,
//     subject: title,
//     text: description.replaceAll("{{name}}", name),
//   };

//   mailgun.messages().send(data, function (error, body) {
//     if (error) {
//       console.log(error);
//     }
//     console.log(body);
//   });
// };
