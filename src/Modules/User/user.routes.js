import { Router } from "express";
import * as controller from './user.controller.js'
import { asyncHandler } from './../../utils/erorrHandling.js';
import { validationCore } from "../../middlewares/validation.js";
import { SignInSchema, SignUPSchema } from "./user.validationSchemas.js";
import { multerFunction } from "../../services/multerLocally.js";
import { isAuth } from './../../middlewares/auth.js';
import { multerCloudFunction } from "../../services/multerCloudi.js";
import { allowedExtensionsArr } from "../../utils/allowedExtensions.js";

const router = Router();

router.post('/signup' ,validationCore(SignUPSchema), asyncHandler(controller.signUP));
router.get('/confirmEmail/:token' , asyncHandler(controller.confirmEmail)); 
router.post('/signin' , validationCore(SignInSchema),asyncHandler(controller.signIn));
router.patch('/update' , controller.update);
router.patch('/updateToken' , asyncHandler(controller.updateWithToken));
router.get('/get/:_id' , asyncHandler(controller.getProfile));

router.get('/getQr/:_id' , asyncHandler(controller.getUser));

router.get('/get' , asyncHandler(controller.getU));  
router.get('/' , asyncHandler(controller.verifyToken));
 
router.post('/profile' , isAuth(), 
    multerFunction(allowedExtensionsArr.Image ,
    'user/profile').single('profile'),
    asyncHandler(controller.profilePicture));

router.post('/cover' , isAuth(),
    multerFunction(allowedExtensionsArr.Image , 
    'user/covers').array('cover')
    ,asyncHandler(controller.coverPictures))

router.post('/profileCloud' , isAuth(), 
    multerCloudFunction(allowedExtensionsArr.Image ,
    'user/profile').single('profile'),
    asyncHandler(controller.profilePictureCloud));

router.post('/coverCloud' , isAuth(),
    multerFunction(allowedExtensionsArr.Image , 
    'user/covers').array('cover')
    ,asyncHandler(controller.coverPicturesCloud))
 
export default router;