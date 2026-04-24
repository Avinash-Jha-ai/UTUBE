import cookieParser from "cookie-parser";
import express from "express"
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/auth.route.js"
import channelRouter from "./routes/channel.route.js"
import contentRouter from "./routes/content.route.js"
import subscribeRouter from "./routes/subscribe.route.js"
import commentRouter from "./routes/comment.route.js"
import userActionRouter from "./routes/userAction.route.js"

 
const app =express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use("/api/channel",channelRouter);
app.use("/api/content",contentRouter);
app.use("/api/subscribe",subscribeRouter);
app.use("/api/comment", commentRouter);
app.use("/api/library", userActionRouter);



export default app;