import multer from "multer";
import fs from 'fs'
import{customAlphabet} from 'nanoid';
import  path  from "path";
import { allowedExtensionsArr } from "../utils/allowedExtensions.js";


const nanoid = customAlphabet('12345_abcdefg' , 5);


export const multerFunction = (allowedExtensions , customPath)=>{

    if(!allowedExtensions){
        allowedExtensions =  allowedExtensionsArr.Image; 
    }

    if(!customPath){
        customPath = 'General'
    }
    
    const destPath = path.resolve(`Uploads/${customPath}`);
    
    //===================== Custom path ========================
    if(!fs.existsSync(destPath)){
        fs.mkdirSync(destPath , {recursive : true}) //gnerate and make 
    }

    //===================== Storage ============================
    const storage = multer.diskStorage({
        destination : function(req , file , cb){
            cb(null , destPath) //null or error
        },
        filename : function(req , file , cb){
            console.log(file);
            const uniqueFilename = nanoid() + file.originalname;
            console.log(file.originalname , uniqueFilename);
            //cb(null , file.originalname) // Filename = originalname
            cb(null , uniqueFilename) // Filename = originalname
        }
    })

    //===================== File  ============================
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