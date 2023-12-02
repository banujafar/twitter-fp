import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storageCloud = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'twitter',
      allowedFormats: ['jpeg', 'png', 'jpg'],
    };
  },
});

export default storageCloud;
