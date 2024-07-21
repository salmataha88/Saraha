import {usermodel} from '../../../DB/Models/user.model.js'
import bcrypt from 'bcrypt'
import {asyncHandler} from '../../utils/erorrHandling.js';
import Jwt  from 'jsonwebtoken';
import { sendEmail } from '../../services/sendEmailService.js';
import cloudinary from '../../utils/cloudinaryConfigurations.js';
import { generateQrCode } from '../../utils/qrCodeFunction.js';


export const signUP = async(req , res , next)=>{

    const {username , email , password , gender} = req.body;
        
    const check = await usermodel.findOne({email});
    if(check){
        return res.status(400).json({Message : 'Email is already exist'})
    }
    
    //Confirm Email
    const token = Jwt.sign({email} , 'confirmToken' , {expiresIn:'1h'});
    const confirmLink = `${req.protocol}://${req.headers.host}/user/confirmEmail/${token}`;

    const message = `<a href = ${confirmLink}> Click to confirm your email </a>`
    const isEmailSent = await sendEmail(
    {
        to : email,
        subject : 'Confirmation Email',
        message
    },{});

    if(!isEmailSent){
        return res.status(500).json({Message : 'Please Try again Later..'})
    }
    //hash pass
    const hashedPass = bcrypt.hashSync(password , +process.env.SALT_ROUNDS ); //OR await bcrypt.hash(password , 8)

    const user = new usermodel({username , email , password: hashedPass , gender});
    await user.save();

    res.status(201).json({Message : "SignUp Successfully.."}) //created
}

//Confirm Email
export const confirmEmail = async(req , res , next)=>{
    const {token} = req.params;
    const decodedData = Jwt.verify(token ,  'confirmToken');
    const check = await usermodel.findOne({email : decodedData.email});
    if(check.isConfirmed){
        res.status(400).send('<h3> Email is  confirmed.. </h3>')
    }
    const user = await usermodel.findOneAndUpdate(
        {email : decodedData.email},
        {isConfirmed : true},
        {new : true}
    )

    res.status(200).send('<h3> Confirmed Done please try to Login... </h3>')
}

//token
export const signIn = async(req , res , next)=>{

    const { email , password } = req.body;
        
    const checkEmail = await usermodel.findOne({email , isConfirmed : true});
    if(!checkEmail){
        //return res.status(400).json({Message : 'Invalid email or password'});
        return next(new Error( 'Invalid email or password' , {cause : 400}));
    }
    
    const passMatch = bcrypt.compareSync(password , checkEmail.password); //return bool
    if(!passMatch){
        return res.status(400).json({Message : 'Invalid email or password'})
    }

    const userToken = Jwt.sign(
        {email, _id:checkEmail._id , username : checkEmail.username},
        'testToken' ,  //testToken --> secret key
        {expiresIn : '1h'}//expire date 
    )  

    res.status(200).json({Message : "SignIn Successfully.." , userToken}) 

}

export const update = async(req , res , next)=>{
    try {
        const { username } = req.body;
        const {LoggedInID , userID} = req.query; //logged in id
        
        const checkUser = await usermodel.findById(userID);
        if(!checkUser){
            return res.status(400).json({Message : 'Invalid userID...'})
        }
        //change id get from db to string because id of query is string not objectID
        if(checkUser._id.toString() !== LoggedInID){
            return res.status(401).json({Message : 'unauthorized to take this action..'})
        }
        const user = await usermodel.findByIdAndUpdate({_id : userID} , {username} , {new : true})
        
        res.status(200).json({Message : "Updated Successfully.." , user})    
       

    } catch (error) {
        res.status(500).json({Message : 'FAIL'});
        console.log(error);
    }

}

export const getProfile = async(req , res , next)=>{
        const { _id} = req.params;
        
        const user = await usermodel.findById(_id).select('username email');
        if(!user){
            return res.status(400).json({Message : 'Invalid ID'})
        }

        res.status(200).json({UserData : user}) 
}

export const getUser = async(req , res , next)=>{
        const { _id} = req.params;
        
        const user = await usermodel.findById(_id).select('username email');
        if(!user){
            return res.status(400).json({Message : 'Invalid ID'})
        }
        
        const qrcode = await generateQrCode({data : user});
        res.status(200).json({UserData : user , qrcode}) 
}

export const getU = asyncHandler(async(req , res , next)=>{
        const user = await usermodel.find().select('username email');
        
        res.status(200).json({UserData : user}) 
})

export const verifyToken = async(req , res , next)=>{
    //kaza mkan mmkn akhod mno l tokens

    //const {token} = req.body;
    //const {token} = req.headers;
    const {authorization} = req.headers; // token write in bearer

    const deCoddData = Jwt.verify(authorization.split(" ")[1], 'testToken')//btfok l token
   // const deCodedData = Jwt.verify(token , 'testToken')//btfok l token

    res.json({Message : 'Done' ,  deCoddData});
} 

export const updateWithToken = async(req , res , next)=>{

    const {authorization} = req.headers; 
    const deCodedData = Jwt.verify(authorization.split(" ")[1],'testToken')

    const { username } = req.body;
    const { userID} = req.query; 
    
    const checkUser = await usermodel.findById(userID);
    if(!checkUser){
        return res.status(400).json({Message : 'Invalid userID...'})
    }
    //change id get from db to string because id of query is string not objectID
    if(checkUser._id.toString() !== deCodedData._id){
        return res.status(401).json({Message : 'unauthorized to take this action..'})
    }
    const user = await usermodel.findByIdAndUpdate({_id : userID} , {username} , {new : true})
    
    res.status(200).json({Message : "Updated Successfully.." , user})  
}

export const profilePicture = async(req , res , next)=>{
    const {_id} = req.authUser;
    if(!req.file){
        return next(new Error('Please upload profile picture' , {cause:400}))
    }
    const user = await usermodel.findByIdAndUpdate(
        _id , 
        {profilePic : req.file.path}, 
        {new : true}
    )
    res.status(200).json({Message : "DONE" , user})
} 

export const profilePictureCloud = async(req , res , next)=>{
    const {_id} = req.authUser;
    if(!req.file){
        return next(new Error('Please upload profile picture' , {cause:400}))
    }

    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {
        folder: `Users/Profiles/${req.authUser._id}`,
        use_filename : true,
        resource_type:'image'
    });

    const user = await usermodel.findByIdAndUpdate(
        _id , 
        {profilePic : {secure_url , public_id}}, 
        {new : true}
    )

    if(!user){
        await cloudinary.uploader.destroy(public_id);
        await cloudinary.api.delete_resources(public_id); //delete bulk of public_ids
    }

    res.status(200).json({Message : "DONE" , user})
} 

export const coverPictures = async(req , res , next)=>{
    const {_id} = req.authUser;
    if(!req.files){
        return next(new Error('Please upload profile pictures' , {cause:400}))
    }
    const user = await usermodel.findById(_id);
    const coverimages = [];

    for (const file of req.files) {
            coverimages.push(file.path);
        
    } 

    user.coverPicture.length ? 
    coverimages.push(...user.coverPicture) : coverimages;

    const userNew = await usermodel.findByIdAndUpdate(
        _id , 
        {coverPicture : coverimages}, 
        {new : true}
    )
    res.status(200).json({Message : "DONE" , userNew})
} 

export const coverPicturesCloud = async(req , res , next)=>{
    const {_id} = req.authUser;
    if(!req.files){
        return next(new Error('Please upload profile pictures' , {cause:400}))
    }
    const user = await usermodel.findById(_id);
    const coverimages = [];

    for (const file of req.files) {

            const {secure_url , public_id} = await cloudinary.uploader.upload(file.path , {
                folder: `Users/Covers/${req.authUser._id}`,
                resource_type:'image'
            });

            coverimages.push({secure_url , public_id});
    
    } 

    user.coverPicture.length ? 
    coverimages.push(...user.coverPicture) : coverimages;

    const userNew = await usermodel.findByIdAndUpdate(
        _id , 
        {coverPicture : coverimages}, 
        {new : true}
    )
    res.status(200).json({Message : "DONE" , userNew})
} 