import { Router } from "express";
import * as controller from './message.controller.js'
import { asyncHandler } from './../../utils/erorrHandling.js';

const router = Router();

router.post('/send' , asyncHandler(controller.sendMessage))
router.get('/get/:_id' , asyncHandler(controller.getUserMsgs))
router.delete('/delete' , asyncHandler(controller.dlete))

export default router;

