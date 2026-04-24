import { Router } from "express";
import {register ,login ,getMe ,logout,updateProfile,changePassword} from "../controllers/auth.controller.js"
import {authenticateUser} from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";


const router =Router();


/**
 * register using email password
 */

router.post("/register", upload.single("avatar"), register);

/**
 * login using email password
 */

router.post("/login",login);

/**
 * get user data 
 */

router.get("/get-me",authenticateUser,getMe);

/**
 * logout
 */

router.get("/logout",logout);

/**
 * update the avatar and fullname
 */
router.post("/update-profile",authenticateUser, upload.single("avatar"), updateProfile);


/**
 * change password with help of oldpassword
 */

router.post("/update-password",authenticateUser,changePassword);

export default router;