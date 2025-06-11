const bcrypt = require("bcrypt");
const crypto = require('crypto');
require("dotenv").config();

const ciphering = 'aes-256-cbc';
const skey = 'test_password_scottiger1'; // Replace with your secret key
const encryption_iv = 'scottiger_iv_123'; // Replace with your encryption IV
const options = 0;

const encryption = (value) => {
   const salt = bcrypt.genSaltSync(
      parseInt(process.env.ENCRYPTION_SALT_ROUNDS)
   );
   const hash = bcrypt.hashSync(value, salt);
   return hash;
};

const check = (value, hash) => {
   hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
   const result = bcrypt.compareSync(value, hash);
   return result;
};

const decrypt = (value) => {
   var decryptor = crypto.createDecipheriv(ciphering, skey, encryption_iv);
   return decryptor.update(value, 'base64', 'utf8') + decryptor.final('utf8');
}

const encrypt = (value) => {
   var encryptor = crypto.createCipheriv(ciphering, skey, encryption_iv);
    return encryptor.update(value, 'utf8', 'base64') + encryptor.final('base64');
}

module.exports = {
   encryption,
   check,
   decrypt,
   encrypt
};
