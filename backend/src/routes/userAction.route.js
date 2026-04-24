import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { 
    addToHistory, 
    getHistory, 
    clearHistory, 
    toggleWatchLater, 
    getWatchLater, 
    getLikedVideos,
    checkWatchLater
} from "../controllers/userAction.controller.js";

const router = Router();

router.use(authenticateUser);

router.post("/history/:videoId", addToHistory);
router.get("/history", getHistory);
router.delete("/history", clearHistory);

router.post("/watchlater/:videoId", toggleWatchLater);
router.get("/watchlater", getWatchLater);
router.get("/watchlater/check/:videoId", checkWatchLater);

router.get("/liked", getLikedVideos);

export default router;
