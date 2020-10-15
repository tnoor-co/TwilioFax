const { RestClient } = require("@signalwire/node");
const functions = require("firebase-functions");

const client = new RestClient(
  functions.config().signalwire.project_id,
  functions.config().signalwire.token,
  {
    signalwireSpaceUrl: functions.config().signalwire.space_url,
  }
);

module.exports = {
  async init() {
    return (
      `<Response>
      <Receive action="/` +
      functions.config().function.url_prefix_signalwire +
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
        from: functions.config().signalwire.from_number,
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
        from: functions.config().signalwire.from_number,
        to: functions.config().general.notify_number,
      })
      .then((message) => console.log(message.sid));
    return true;
  },
  async sendFaxStatusUpdate(statusUpdate) {
    await client.messages
      .create({
        body: "📠 Alert - Status Update:\n\n" + statusUpdate,
        from: functions.config().signalwire.from_number,
        to: functions.config().general.notify_number,
      })
      .then((message) => console.log(message.sid));
    return true;
  },
};
