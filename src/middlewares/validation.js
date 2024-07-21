//req => userdata 
//schema => endPoint schema (API)

const reqMethods = ['body' , 'query' , 'params' , 'headers' , 'file' ,'files'];

import joi from 'joi';

export const generalFields = {
  email: joi.string().email({ tlds: { allow: ['com', 'net', 'org'] } }).required(),
  password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  // Add more common fields as needed
};


export const validationCore = (schema)=>{
    return(req , res , next)=>{
        const errorArray = []
        for (const key of reqMethods) {
            if(schema[key]){
                const result = schema[key].validate(req[key] , {abortEarly : false }) 
                //3shan lw mshm3mol req.body w mfesh schema of body hydena error
                console.log(result);
                if(result.error){
                    errorArray.push(result.error.details);
                }
            }
        }
        if(errorArray.length)
            return res.status(400).json({Message : 'Validation Error' , Errors : errorArray})
       next();

    }
} 

/**
 * Schema :{
 *      query :{
 *              username:value, email:valus
 *      }
 * }
 * 3yza a3ml validation 3la l query bs lkn mmkn ykon ba3t data fl body bs na msh3yza a3ml validation 3leha 
*/