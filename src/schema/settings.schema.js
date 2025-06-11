const mongoose = require('mongoose');
const {Schema} = mongoose;

const settingSchema = new Schema({
    name: { type: String },
    val: { type: Schema.Types.Mixed },
    autoload: { type: Number, default: 1 },
    __v: { type: Number, select: false }
});

settingSchema.set('toObject', { getters: true });
settingSchema.set('toJSON', { getters: true });

module.exports = settingSchema;