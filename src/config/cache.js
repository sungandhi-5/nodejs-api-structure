const redis = require('redis');
const { error_log, info_log } = require('../utils/lib/log.lib');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD
});

(async () => {
    await redisClient.connect();
})();

redisClient.on('connect', () => info_log('Redis Client Connected'));
redisClient.on('error', (err) => error_log('Redis Client Connection Error', err));

module.exports = redisClient;