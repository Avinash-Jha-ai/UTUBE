import { Router } from "express";
import {authenticateUser, optionalAuthenticateUser} from "../middlewares/auth.middleware.js"
import {createChannel,updateChannel,deleteChannel,getMyChannel,getChannelByHandle} from "../controllers/channel.controller.js"
import { upload } from "../middlewares/multer.middleware.js";


const router =Router();

/**
 * create channel
 */
router.post("/create-channel", authenticateUser, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), createChannel);

/**
 * get my channel
 */
router.get("/get-channel",authenticateUser,getMyChannel);

/**
 * get Channel By Handle
 */
router.get("/:handle",optionalAuthenticateUser,getChannelByHandle)

/**
 * update channel
 */
router.post("/update-channel", authenticateUser, upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'banner', maxCount: 1 }
]), updateChannel);

/**
 * delete my channel
 */
router.get("/delete/:handle",authenticateUser,deleteChannel);

export default router;