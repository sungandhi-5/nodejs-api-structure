const fs = require('fs');
const path = require('path');

const uploadFileLocal = async (file, path) => {
    const filePath = __dirname + '/../../../' + path;
    fs.writeFileSync(filePath, file.data);
    return true;
}

const readFileLocal = (file, path) => {

    const filePath = __dirname + '/../' + path;
    // if (fs.existsSync(filePath)) {
        return process.env.NODE_URL + path + file;
    // } else {
    //     return process.env.NODE_URL + path + 'default.jpg';
    // }
}

const checkFileLocal = async (file, path) => {
    const filePath = __dirname + '/../' + path + file;
    // if (fs.existsSync(filePath)) {
        return process.env.NODE_URL + path + file;
    // } else {
    //     return false;
    // }
}

module.exports = {
    uploadFile: uploadFileLocal,
    readFile: readFileLocal,
    checkFile: checkFileLocal,
};
