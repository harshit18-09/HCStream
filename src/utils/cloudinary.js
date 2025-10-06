import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (local) => {
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload
        (localFilePath, {
            resource_type: "auto"       
        })
        console.log("file uploaded to cloudinary", response.url);
        return response.url;
    }catch(err){
        fs.unlinkSync(localFilePath);    //remove the local temp file if the upload opp fails in any case
        console.log("cloudinary upload error", err);
        return null;
    }
}

export {uploadOnCloudinary};