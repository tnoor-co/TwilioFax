const functions = require("firebase-functions");
const client = require("twilio")(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

module.exports = {
  async init() {
    return (
      `<Response>
      <Receive action="/` +
      functions.config().function.url_prefix_twilio +
      `/process"/>
      </Response>`
    );
  },

  async sendFaxInProgressSms(fromNumber, toNumber) {
    await client.messages
      .create({
        body:
          "📠 Alert - You are receiving a fax from " +
          fromNumber +
          " at " +
          toNumber +
          ".",
        from: functions.config().twilio.from_number,
        to: functions.config().general.notify_number,
      })
      .then((message) => console.log(message.sid));
    return true;
  },

  async sendFaxReceivedSms(fromNumber, toNumber, url) {
    await client.messages
      .create({
        body:
          "📠 Alert - You have received a fax from " +
          fromNumber +
          " at " +
          toNumber +
          " - View here ➜ " +
          url,
        from: functions.config().twilio.from_number,
        to: functions.config().general.notify_number,
      })
      .then((message) => console.log(message.sid));
    return true;
  },
  async sendFaxStatusUpdate(statusUpdate) {
    await client.messages
      .create({
        body: "📠 Alert - Status Update:\n\n" + statusUpdate,
        from: functions.config().twilio.from_number,
        to: functions.config().general.notify_number,
      })
      .then((message) => console.log(message.sid));
    return true;
  },
};
