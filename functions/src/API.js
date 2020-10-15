const TwilioRouter = require("./TwilioRouter.js");
const SignalWireRouter = require("./SignalWireRouter.js");
const functions = require("firebase-functions");

exports.twilioFaxReceive = functions.https.onRequest(async (req, res) => {
  try {
    await TwilioRouter.route(req, res);
  } catch (e) {
    console.log(e);
    res.setHeader("Content-Type", "application/json");
    res.status(422).send({ error: e.message });
  }
});

exports.signalWireFaxReceive = functions.https.onRequest(async (req, res) => {
  try {
    await SignalWireRouter.route(req, res);
  } catch (e) {
    console.log(e);
    res.setHeader("Content-Type", "application/json");
    res.status(422).send({ error: e.message });
  }
});
