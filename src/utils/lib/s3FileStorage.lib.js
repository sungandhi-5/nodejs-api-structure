const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { error_log, info_log, debug_log } = require('./log.lib');
const bucket = process.env.AWS_BUCKET

const s3Path = process.env.AWS_URL;

const uploadFileS3 = async (file, resizedBuffer, path) => {

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!allowedFileTypes.includes(file.mimetype)) {
        return false;
    }
    const params = {
        Bucket: bucket,
        Key: path,
        Body: resizedBuffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };
    const s3 = new S3Client({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    try {
        let uploadFileS3Res = new Upload({client: s3, params})
        await uploadFileS3Res.done();
        info_log('Image uploaded successfully. S3 location:', data.Location);
    } catch (error) {
        error_log('Error uploading image:', error);
        return false;
    }
}

const readFileS3 = (file, path) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    const s3 = new AWS.S3();
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: path + file,
    };
    return s3Path + path + file;

}

const checkFileS3 = (file, path) => {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    });
    const s3 = new AWS.S3();
    const params = {
        Bucket: process.env.AWS_BUCKET,
        Key: path + file,
    };
    return s3Path + path + file;
}

module.exports = {
    uploadFile: uploadFileS3,
    readFile: readFileS3,
    checkFile: checkFileS3,
};
