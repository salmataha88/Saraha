
export const asyncHandler = (API)=>{
    return (req , res , next)=>{ //because function of api return req , res , next (middleware)
        API(req , res , next).catch((err)=>{
            res.status(500).json({Message : 'FAIL'});
            console.log(err);
        })
    }
}