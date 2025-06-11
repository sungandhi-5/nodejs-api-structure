const CRUDModel = require('./crud');

class SettingsModel extends CRUDModel{
    constructor(){
        super("settings", "settings");
    }
}

module.exports = new SettingsModel();