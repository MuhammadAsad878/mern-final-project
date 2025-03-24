import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { configDotenv } from 'dotenv';
configDotenv();

import pkg from 'cloudinary';  // EJS is not working with this import so first import cloudinary and then destructure it
const { v2: cloudinary } = pkg;
// Configure Cloudinary  like connecting backend with cloudinary account
(async function() {
  // Configuration
  cloudinary.config({ 
      cloud_name: process.env.CLOUD_NAME, // Click 'View API Keys' above to copy your cloud name
      api_key: process.env.CLOUD_API_KEY, // Click 'View API Keys' above to copy your API key
      api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
  });   
})();

// Configure Multer Storage with Cloudinary like making a folder in drive where we want to save the files
const storage  = new CloudinaryStorage({
  cloudinary: cloudinary,      // 
  params: {
    folder: 'homeEase', // The name of the folder in cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // The allowed File formats
  },
});


export { cloudinary, storage };

