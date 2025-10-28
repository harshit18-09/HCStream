import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || !allowedOrigins.length || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}))
app.use(express.json({
    limit: '16kb'
}));
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));
app.use(express.static('public'));
app.use(cookieParser()); //there are options in this also if needed 

//routes import
import userRouter from './routes/user.routes.js';
import healthcheckRouter from './routes/healthcheck.route.js';
import tweetRouter from './routes/tweet.route.js';
import subscriptionRouter from './routes/subscription.route.js';
import videoRouter from './routes/video.route.js';
import likeRouter from './routes/like.route.js';
import playlistRouter from './routes/playlist.route.js';
import commentRouter from './routes/comment.route.js';
import dashboardRouter from './routes/dashboard.route.js';
//routes declaration
app.use("/api/v1/users", userRouter);    //http://localhost:8000/api/v1/users/<anyroute in user.routes.js>
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(errorHandler);


export { app };