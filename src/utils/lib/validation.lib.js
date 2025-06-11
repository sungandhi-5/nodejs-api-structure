var Validator = require("validatorjs");
const General = require("./general.lib");
const { default: mongoose } = require("mongoose");

const valiadate_rules = {
    "login": {
        email: "required|email",
        password: "required|min:6",
    },
    "signup": {
        name: "required|min:3|max:50",
        email: "required|email|unique:users,email",
        password: "required|min:6|confirmed",
        password_confirmation: 'required',
    },
};

const customeMessage = (param) => {
    let custome_msg = {
        deposit_admin_address: {
            'required.coin_id': "Please select coin.",
            'required.rpc_id': "Please select rpc.",
        }
    };

    let pathArray = param.split('.');
    let result = pathArray.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), custome_msg);

    return result;
}
Validator.register('objectId', (value) => {
    return mongoose.Types.ObjectId.isValid(value)
 }, 'Invalid :attribute.');
Validator.register('nullable', (value, requirement, attribute) => {
    return !(value === null || value === undefined || value === '');
}, 'The :attribute field must be nullable.');

Validator.register('image', function (value, requirement, attribute) {
    if (typeof value.name == "undefined") return false;
    var allowedExtensions = ['jpeg', 'jpg', 'png'];
    var fileExtension = value.name.split('.').pop().toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
        return true;
    }
}, 'The :attribute must be image.');

Validator.register('mimes', function (value, requirement, attribute) {
    var allowedMimeTypes = requirement.split(",");
    for (let i = 0; i < allowedMimeTypes.length; i++) {
        allowedMimeTypes[i] = 'image/' + allowedMimeTypes[i];
    }
    return allowedMimeTypes.includes(value.mimetype);
}, 'The :attribute must be type of :mimes');

Validator.register('size_max', function (value, requirement, attribute, passes) {
    if ((value.size / 1000) < requirement) {
        return true;
    }
}, "The :attribute size must be less than :size_max KB.");

/**
 * this function return validation rules
 */
const get_rules = (rules) => {
    return valiadate_rules[rules];
};

/**
 * this function is validate the validation rlues
 */
const custom_validation = (data, rules, msg = {}) => {
    let validation;
    if (typeof rules === 'object') validation = new Validator(data, rules, msg);
    else validation = new Validator(data, get_rules(rules), msg);
    if (validation.fails()) {
        let error = "";
        for (let key in validation.errors.errors) {
            error = validation.errors.errors[key][0];
        }
        return General.validation_res(error);
    }
    return General.success_res("Success");
};

function checkDecimalPlaces(data) {
    for (const key in data) {
        // Skip fields with type 'number'
        if (typeof data[key] === 'number') {
            continue;
        }

        // Check if the value is numeric and has more than 8 decimal places
        if (typeof data[key] === 'number' && data[key] % 1 !== 0) {
            const [, decimalPart] = data[key].toString().split('.');
            if (decimalPart && decimalPart.length > 8) {
                return false;
            }
        } else if (typeof data[key] === 'string') {
            const [, decimalPart] = data[key].split('.');
            if (decimalPart && decimalPart.length > 8) {
                return false;
            }
        }
    }
    return true;
}
module.exports = {
    get_rules,
    custom_validation,
    customeMessage,
    checkDecimalPlaces,
};
