const General = require("../utils/lib/general.lib");
const constants = require("../config/constants");
const UserTokenModel = require("../model/userToken.model");
const { debug_log } = require("../utils/lib/log.lib");
const UserModel = require("../model/user.model");

const sessionChecker = async (req, res, next) => {
    
    const token = req.header('X-API-TOKEN');
    if (!token) {
        return res.json(General.error_res("Unauthorized access, please login first."));
    }

    let findArray = {
        ip: General.getIp(req),
        ua: req.get("User-Agent"),
        type: constants.TOKEN_TYPE.AUTH,
        token: token
    }
    
    let userToken = await UserTokenModel.findOne(findArray);
    if(!userToken){
        return res.json(General.error_res("Unauthorized access, please login first."));
    }
    let user = await UserModel.findOne({_id:userToken.user_id});
    if(!user){
        return res.json(General.error_res("Unauthorized access, please login first."));
    }
    if(user.status != constants.USER_STATUS.ACTIVE){
        return res.json(General.error_res("Account is not active, please contact support."));
    }
    req.user = user;

    next();
};

module.exports = {
    sessionChecker,
}