const CRUDModel = require('./crud');

class UserModel extends CRUDModel{
    constructor(){
        super("users", "users");
    }

}

module.exports = new UserModel();