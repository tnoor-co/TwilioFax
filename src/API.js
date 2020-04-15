const Router = require("./Router.js");

exports.twilioFaxReceive = async (req, res) => {
  // Top level entry point
  try {
    await Router.route(req, res);
  } catch (e) {
    console.log(e);
    res.setHeader("Content-Type", "application/json");
    res.status(422).send({ error: e.message });
  }
};
