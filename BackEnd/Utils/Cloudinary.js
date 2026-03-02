const cloudinary=require("cloudinary").v2;
cloudinary.config({
    cloud_name:"duzpdbmzf",
  api_key: 594983594527376,
  api_secret: "YQEWZgGwuflLdMkDWDvGjc41zs4"

})
async function deleteCloudinaryFiles(publicIds = []) {
  for (let id of publicIds) {
    if (id) await cloudinary.uploader.destroy(id);
  }
}

module.exports = { cloudinary,deleteCloudinaryFiles };
