import {usermodel} from '../../../DB/Models/user.model.js'
import { messagemodel } from './../../../DB/Models/messages.models.js';

export const sendMessage = async(req , res , next)=>{
    const {content , sendTo} = req.body;
    const user = await usermodel.findById(sendTo);
    if(!user){
        return res.status(400).json({Message : "NOT FOUND"})
    }
    const msg = new messagemodel({
        content , sendTo
    });
    await msg.save();
    return res.status(200).json({Message : "DONE"})
}

export const getUserMsgs = async(req , res , next)=>{
    const {_id} = req.params;

    const msg = await messagemodel.find({sendTo : _id});

    if(msg.length){
        return res.status(200).json({Message : "DONE" , msg})
    }
    
    return res.status(200).json({Message : "Empty Box"})

}

export const dlete = async(req , res , next)=>{
    const {msgID , LogID} = req.params;

    const msg = await messagemodel.findOneAndDelete({sendTo : LogID , _id: msgID});

    if(msg){
        return res.status(200).json({Message : "DONE" , msg})
    }
    
    return res.status(401).json({Message : "unauthorized"})

}