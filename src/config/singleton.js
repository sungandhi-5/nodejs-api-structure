const SettingModel = require('../model/settings.model');
const { error_log, debug_log } = require('../utils/lib/log.lib');

class Setting {
    static _response = {};
    constructor() {
        if (Setting._instance) {
            debug_log("Setting instance already exist");

            return Setting._instance;
        }
        Setting._instance = this;
        (async () => {
            const allSettings = await SettingModel.find({ autoload: 1 });

            let result = {};
            allSettings.forEach(setting => { result[setting.name] = setting });
            Setting._response = result;
        })();
    }

    async set() {
        try {
            const allSettings = await SettingModel.getSettings({ autoload: 1 });

            let result = {};
            allSettings.forEach(setting => { result[setting.name] = setting });
            Setting._response = result;
            debug_log(["Setting response", Setting._response]);
        } catch (error) {
            error_log("something went wrong Settings set function with error message: ", error)
        }
    }

    get(setting_name) {
        try {
            return Setting._response[setting_name];
        } catch (error) {
            error_log("something went wrong Settings get function with error message: ", error)
        }
    }
};

module.exports = {
    Settings: new Setting(),
}