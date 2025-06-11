const CRUDModel = require('./crud');
class UserTokenModel extends CRUDModel {
    constructor() {
        super("user_token", "userToken");
    }
}

module.exports = new UserTokenModel();