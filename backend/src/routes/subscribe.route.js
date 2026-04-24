import express from "express";
import {
    subscribeChannel,
    unsubscribeChannel,
    getSubscriberCount,
    getUserSubscriptions,
    isSubscribed
} from "../controllers/subscribe.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// subscribe / unsubscribe
router.post("/:channelId", authenticateUser, subscribeChannel);
router.delete("/:channelId", authenticateUser, unsubscribeChannel);

// get count
router.get("/count/:channelId", getSubscriberCount);

// get all channels user subscribed
router.get("/me", authenticateUser, getUserSubscriptions);

// check subscribed or not (for button toggle)
router.get("/check/:channelId", authenticateUser, isSubscribed);

export default router;