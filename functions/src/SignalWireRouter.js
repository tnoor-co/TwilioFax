const routeParser = require("route-parser");
const Cloudinary = require("./Cloudinary.js");
const SignalWire = require("./SignalWire.js");

module.exports = {
  async route(req, res) {
    const routes = [
      [
        "POST",
        "/init",
        async () => {
          await SignalWire.sendFaxInProgressSms(req.body.From, req.body.To);
          res
            .set("Content-Type", "text/xml")
            .status(200)
            .send(await SignalWire.init())
            .end();
        },
      ],
      [
        "POST",
        "/process",
        async () => {
          res.setHeader("Content-Type", "application/json");
          if (req.body.MediaUrl == null || req.body.MediaUrl == undefined) {
            await SignalWire.sendFaxStatusUpdate(
              `No fax content was received from ${req.body.From}`
            );

            return res
              .status(200)
              .send({
                message:
                  "MediaUrl was not provided indicating that this wasn't a fax or an error has occurred.",
              })
              .end();
          }

          const imageUrl = await Cloudinary.uploadFile(req.body.MediaUrl);
          if (imageUrl != null) {
            await SignalWire.sendFaxReceivedSms(
              req.body.From,
              req.body.To,
              imageUrl
            );
          }

          res.status(200).send().end();
        },
      ],
      [
        "POST",
        "/statusChange",
        async () => {
          await SignalWire.sendFaxStatusUpdate(req.rawBody);
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
