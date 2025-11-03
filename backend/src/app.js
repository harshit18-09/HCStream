import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// When running behind a load balancer / proxy (ALB) express needs to
// trust the proxy in order to correctly detect secure connections
// and to allow secure cookies to be set when behind HTTPS-terminating proxies.
// This is important when your app is deployed behind AWS ALB/ECS.
app.set('trust proxy', 1);

app.get("/", (req, res) => {
    res.status(200).send("OK");
});

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
// capture raw body for debugging (adds `req.rawBody`). Keep limits sane.
// The `verify` function won't interfere with parsing; it only captures the buffer.
app.use(express.json({
    limit: '16kb',
    verify: (req, res, buf, encoding) => {
        try {
            req.rawBody = buf.toString(encoding || 'utf8');
        } catch (e) {
            // ignore if no body present
        }
    }
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));

// Lightweight debug logger for login route to help diagnose missing req.body
// Remove or guard this in production after debugging.
app.use((req, res, next) => {
    if (req.method === 'POST' && req.path && req.path.startsWith('/api/v1/users/login')) {
        console.log('[DEBUG] Login request headers:', {
            origin: req.headers.origin,
            host: req.headers.host,
            'content-type': req.headers['content-type'],
            'content-length': req.headers['content-length']
        });
        console.log('[DEBUG] req.rawBody:', req.rawBody);
    }
    next();
});
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