import joi from 'joi';
import { generalFields } from '../../middlewares/validation.js';

export const SignUPSchema = {
  body : joi
  .object({
        username: joi.string().min(3).max(12).required(),
        email: generalFields.email,
        password: generalFields.password,
        //cPassword : joi.valid(joi.ref('password'))
        gender: joi.string().optional(),
    })
    .required()
} 
export const SignInSchema = {
  body : joi
  .object({
        email: generalFields.email,
        password: generalFields.password,
    }).options({presence : 'required'})
    .required()
} 

