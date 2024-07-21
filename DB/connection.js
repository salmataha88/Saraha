import mongoose from 'mongoose';

// Connect MongoDB at default port 27017.
export const DBconnection = async()=> {
    return await mongoose.connect('mongodb://127.0.0.1:27017/Saraha')
    .then((res)=> console.log("DB CONNECTION SUCCESS"))
    .catch((err)=> console.log("DB CONNECTION FAIL" , err))
}