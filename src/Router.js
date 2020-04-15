const routeParser = require("route-parser");
const Cloudinary = require("./Cloudinary.js");
const Twilio = require("./Twilio.js");

module.exports = {
  async route(req, res) {
    // Define routes that can be handled
    const routes = [
      [
        "POST",
        "/init",
        async () => {
          await Twilio.sendFaxInProgressSms(req.body.From);
          res
            .set("Content-Type", "text/xml")
            .status(200)
            .send(await Twilio.init())
            .end();
        },
      ],
      [
        "POST",
        "/process",
        async () => {
          res.setHeader("Content-Type", "application/json");
          if (req.body.MediaUrl == null || req.body.MediaUrl == undefined) {
            return res
              .status(400)
              .send({ error: "MediaUrl was not provided." })
              .end();
          }
          const imageUrl = await Cloudinary.uploadFile(req.body.MediaUrl);
          if (imageUrl != null) {
            await Twilio.sendFaxReceivedSms(req.body.From, imageUrl);
          }

          res.status(200).send().end();
        },
      ],
      [
        "POST",
        "/statusChange",
        async () => {
          await Twilio.sendFaxStatusUpdate(req.rawBody);
          res.status(200).send().end();
        },
      ],
    ];

    // Match route and call handler
    for (let i = 0; i < routes.length; ++i) {
      const method = routes[i][0];
      const route = routes[i][1];
      const handler = routes[i][2];
      if (req.method !== method) {
        continue;
      }
      const matchedPath = new routeParser(route).match(req.path);
      if (matchedPath) {
        await handler(matchedPath);
        return;
      }
    }

    // No routes were matched, respond with 404
    res
      .status(404)
      .send({ error: `404 Not found: [${req.method} ${req.path}]` });
  },
};
