const General = require("../utils/lib/general.lib");
const { debug_log, access_log } = require("../utils/lib/log.lib");
module.exports = async (req, res, next) => {
    const incomingTime = new Date().toISOString(); // Convert incoming time to ISO 8601 format
    const requestedUrl = req.url; // Get the requested URL
    const requesterIpAddress = General.getIp(req); // Get the requester's IP address
    debug_log(['Req Header Remote IP: ', requesterIpAddress]);

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.on('finish', () => {
        const outgoingTime = new Date().toISOString(); // Convert outgoing response time to ISO 8601 format
        const totalDuration = new Date(outgoingTime) - new Date(incomingTime); // Calculate the total duration in milliseconds
        access_log(`${res.statusCode} - URL: ${requestedUrl}, IP: ${requesterIpAddress}, Req Time: ${incomingTime}, Res Time: ${outgoingTime}, Duration: ${totalDuration}ms`);
    });
    next();
};