import { Schema, model } from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const messageSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    sendTo:{
        type:Schema.Types.ObjectId,
        ref : 'User',
        required:true,
    },  
},
{
    timestamps : true
});

//Export the model
export const messagemodel = model('Msg', messageSchema);