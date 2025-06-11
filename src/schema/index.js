const { error_log } = require("../utils/lib/log.lib");

const getSchemaByName = function (schemaName) {
    let Schema = null;
    let modulePath = './' + schemaName + '.schema.js';
    try {
        Schema = require(modulePath);
    } catch (error) {
        error_log(`Error loading module ${modulePath}:`, error);
        return null;
    }

    return Schema;
};

module.exports = {
    getSchemaByName,
}