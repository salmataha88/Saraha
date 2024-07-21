import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    gender:{ 
        type : String,
        enum : ['female' , 'male' , 'not specified'],
        default : 'not specified'
    },
    profilePic : { //object when store in cloud
        secure_url: String , 
        public_id : String
    },
    coverPicture : [{
        secure_url: String , 
        public_id : String
    }],
    isConfirmed : {
        type :Boolean,
        default : false
    }
},
{
    timestamps :true
});

//Export the model
export const  usermodel = model('User', userSchema);