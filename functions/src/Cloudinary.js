const functions = require("firebase-functions");

module.exports = {
  async uploadFile(url) {
    // eslint-disable-next-line no-var
    var cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: functions.config().cloudinary.cloud_name,
      api_key: functions.config().cloudinary.api_key,
      api_secret: functions.config().cloudinary.api_secret,
    });

    try {
      await cloudinary.uploader.upload(url, function (error, result) {
        if (error) {
          console.log(error);
          return null;
        }

        return result.secure_url;
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
