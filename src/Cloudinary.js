module.exports = {
  async uploadFile(url) {
    // eslint-disable-next-line no-var
    var cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CloudinaryCloudName,
      api_key: process.env.CloudinaryApiKey,
      api_secret: process.env.CloudinaryApiSecret,
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
