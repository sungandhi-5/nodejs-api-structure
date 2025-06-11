require("dotenv").config();

module.exports = {
   PLATFORM_NAME: "Node Bootstrap",
   SUPPORT_EMAIL: "support@bootstrap.com",
   

   AUTH_TOKEN_STATUS: 0,
   
   NOTIFY_CURL_CONNECTIONTIMEOUT : 2000, // in milliseconds

   TOKEN_TYPE : {
      AUTH : 0,
   },

   USER_STATUS : {
      INACTIVE:0,
      ACTIVE:1,
      SUSPEND:2
   },

   AUTH_TOKEN_LENGTH: 15,
   CLEANUP_LOGS_INTERVAL : 7, // in days
};
