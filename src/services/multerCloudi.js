import multer from "multer";
import { allowedExtensionsArr } from '../utils/allowedExtensions.js';

export const multerCloudFunction = (allowedExtensions )=>{

    if(!allowedExtensions){
        allowedExtensions =  allowedExtensionsArr.Image; 
    }

    //===================== Storage ============================
    const storage = multer.diskStorage({});

    //===================== File  ==============================
    const fileFilter = function(req , file , cb){
        console.log(file);
        if(allowedExtensions.includes(file.mimetype)){
           return cb(null , true);
        }
        //cb('invalid extension' , false);
        cb(new Error('invalid extension', {cause : 400}), false);
    }
 
    const fileUpload = multer({fileFilter , storage , limits:{
        fields : 2,//text m3 lfile 
        files : 2   
    }});
    return fileUpload;
}