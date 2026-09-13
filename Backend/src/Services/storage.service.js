require("dotenv").config();

const ImageKit = require("imagekit");

const imageKitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(buffer, fileName = "image.jpg") {
  try {
    const result = await imageKitClient.upload({
      file: buffer,
      fileName,
    });

    return result;
  } catch (error) {
    console.error("ImageKit upload failed:", error.message);
    throw error;
  }
}

module.exports = uploadFile;