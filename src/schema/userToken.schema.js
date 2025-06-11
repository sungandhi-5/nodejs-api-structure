const mongoose = require('mongoose');
const General = require('../utils/lib/general.lib');

const userTokenSchema = new mongoose.Schema({
    user_id: {
        type: String,
    },
    token: {
        type: String,
    },
    type: {
        type: String
    },
    ip: {
        type: String,
    },
    ua: {
        type: String,
    },
    status: {
        type: Number,
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, strict: false });

userTokenSchema.virtual('readable_created_at').get(function () {
    return General.DateInHumanReadleFormat(this.created_at);
});

userTokenSchema.virtual('readable_tooltip').get(function(){
    return General.DateInTooltipFormatter(this.created_at);
});

userTokenSchema.virtual('broswer_icon').get(function () {
    let broswer_detail = General.getBrowser(this.ua);
    let broswer_name = broswer_detail.name;
    let broswer_name_format = broswer_name.toLowerCase().replace(/ /g, '_');
    const broswer_icon = General.getBrowserIcon(broswer_name_format);
    return broswer_icon;
});

userTokenSchema.set('toObject', { getters: true });
userTokenSchema.set('toJSON', { getters: true });

module.exports = userTokenSchema;