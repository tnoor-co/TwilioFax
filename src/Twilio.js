module.exports = {
  async init() {
    return (
      `<Response>
      <Receive action="/` +
      process.env.FunctionUrlPrefix +
      `/process"/>
      </Response>`
    );
  },

  async sendFaxInProgressSms(fromNumber) {
    const client = require("twilio")(
      process.env.TwilioAccountSid,
      process.env.TwilioAuthToken
    );

    await client.messages
      .create({
        body: "📠 Alert - You are receiving a fax from " + fromNumber + ".",
        from: process.env.TwilioFromNumber,
        to: process.env.NotifyNumber,
      })
      .then((message) => console.log(message.sid));
    return true;
  },

  async sendFaxReceivedSms(fromNumber, url) {
    const client = require("twilio")(
      process.env.TwilioAccountSid,
      process.env.TwilioAuthToken
    );

    await client.messages
      .create({
        body:
          "📠 Alert - You have received a fax from " +
          fromNumber +
          " - View here ➜ " +
          url,
        from: process.env.TwilioFromNumber,
        to: process.env.NotifyNumber,
      })
      .then((message) => console.log(message.sid));
    return true;
  },
  async sendFaxStatusUpdate(statusUpdate) {
    const client = require("twilio")(
      process.env.TwilioAccountSid,
      process.env.TwilioAuthToken
    );

    await client.messages
      .create({
        body: "📠 Alert - Status Update:\n\n" + statusUpdate,
        from: process.env.TwilioFromNumber,
        to: process.env.NotifyNumber,
      })
      .then((message) => console.log(message.sid));
    return true;
  },
};
