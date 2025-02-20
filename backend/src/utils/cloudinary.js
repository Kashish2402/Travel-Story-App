import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { fs } from "fs";

dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINAY_API_KEY,
  api_secret: process.env.CLOUDINAY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return next(new ApiError(404, "File Not Found!!!"));

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(`FILE SUCCESSFULLY UPLOADED ON CLOUDINARY`);

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.existsSync(localFilePath) && fs.unlink(localFilePath);
    return null;
  }
};
