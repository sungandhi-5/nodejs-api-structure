const express = require('express');
const session = require('express-session');
var cors = require('cors')
const cookieParser = require("cookie-parser");
const authRoute = require('./route/auth.route');
const userRoute = require('./route/user.route');
const requestLog = require('./middleware/requestlog.middleware');
const { connect } = require('./utils/db.helper');
const { AllCoin } = require('./config/singleton');
const localFileStorage = require('./utils/lib/localFileStorage.lib');
// const s3FileStorage = require('./utils/lib/s3FileStorage.lib');
const fileUpload = require("express-fileupload");
const { error_log, cleanupLogs, info_log, debug_log } = require('./utils/lib/log.lib');
const Constants = require('./config/constants');

const app = express();

const PORT = process.env.PORT || 3007;
app.use(cors({ origin: true, credentials: true }));
app.use(cors())
// file-storage

global.language;
global.locale;
global.fileStorage = localFileStorage

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

app.use('/assets', express.static(__dirname + './../assets'));
app.use('/robots.txt', express.static(__dirname + './../robots.txt'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
        createParentPath: true,
    })
);

const parsedUrl = new URL(process.env.NODE_URL);
let sessionConfig = {
    name: 'node_bootstrap',
    proxy: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { secure: false, domain: parsedUrl.hostname, sameSite: 'Lax' }
}
if (process.env.NODE_ENV === 'local') {
    const RedisStore = require("connect-redis").default
    const redisClient = require("./config/cache");
    let redisStore = new RedisStore({
        client: redisClient
    })
    sessionConfig.store = redisStore
}
if (process.env.NODE_ENV != 'local') {
    app.set('trust proxy', 1) // trust first proxy
    sessionConfig.cookie.secure = true
}
app.use(
    session(sessionConfig)
);
app.disable('x-powered-by');
app.use('/', [requestLog], authRoute);
app.use('/user', [requestLog], userRoute);

app.all('*', (req, res) => {
    res.status(404);
    return res.render('error/404');
});


// Route for 404 page
app.use((req, res, next) => {
    res.status(404).render('error/404');
});


//  handling uncaught exception and unhandled rejection
process.on('unhandledRejeciotn', (reason, p, req, res) => {
    error_log("unhandledRejection --> ", p);
    const errorMessage = `${new Date()} ${reason.stack} Unhandled Rejection at Promise ${p}\n`;
    error_log(errorMessage);
    // process.exit(1)

})
process.on('uncaughtException', (err) => {
    const errorMessage = `${new Date()} ${err.stack} Uncaught Exception thrown\n`;
    error_log("errorMessage", err);
    error_log(errorMessage);
    // process.exit(1);
});


app.listen(PORT, async () => {
    info_log("Server Running on PORT:", PORT);
    info_log("Server URL:", process.env.NODE_URL);
    await connect();
    info_log("Database connected sucessfully");
});

// Cleanup logs
setTimeout(cleanupLogs, Constants.CLEANUP_LOGS_INTERVAL * 24 * 60 * 60 * 1000);