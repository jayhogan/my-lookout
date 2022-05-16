const formData = require('form-data');
const Mailgun = require('mailgun.js');

const domain = process.env.MAILGUN_DOMAIN;
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

function sendBusEmail(to, imageBuffer) {
  const message = {
    from: `"My Lookout" <mailgun@${domain}>`,
    subject: "Mac's bus is here!",
    html: '<img alt="bus" id="1" src="cid:bus.png"/>',
    inline: {
      filename: 'bus.png',
      data: imageBuffer,
    },
    to,
  };

  return mg.messages.create(domain, message);
}

module.exports = {
  sendBusEmail,
};
