const constants = require("../config/constants");
const General = require("../utils/lib/general.lib");

class UserController {

    getDashBoard = (req, res) => {
        try {
            const user = req.user;
            return res.json(General.success_res("success!", user))
        } catch (error) {
            error_log("Get Dashboard Error:", error);
            return res.json(General.error_res("Something went wrong!"));
        }
    }
}

module.exports = new UserController();