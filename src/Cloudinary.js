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
      let imageUrl = "";
      await cloudinary.uploader.upload(url, function (error, result) {
        if (error) {
          console.log(error);
          imageUrl = null;
        }

        imageUrl = result.secure_url;
      });

      return imageUrl;
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
