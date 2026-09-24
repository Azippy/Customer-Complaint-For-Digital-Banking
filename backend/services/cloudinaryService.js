const cloudinary = require("../config/cloudinary.js");

const deleteFile = async (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

module.exports = {
  deleteFile,
};
