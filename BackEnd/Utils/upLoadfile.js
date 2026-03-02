const {cloudinary} = require("./Cloudinary");
const streamifier = require("streamifier");

const uploadFile = (file,folderPath) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto",folder: folderPath },
      (err, result) => {
        if (result) resolve(result);
        else reject(err);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

module.exports = uploadFile;
