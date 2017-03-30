'use strict';

const crypto = require('crypto');
const os = require('os');
let sequence = 1;
let pastTime = null;
let cipherText;

class Identifier {
    static tripledesEncrypt(plainText, key, iv) {
        if (iv === undefined) {
            iv = crypto.randomBytes(8);
        }

        const cipher = crypto.createCipheriv('des-ede3-cfb8', key, iv);
        let cipherText = cipher.update(plainText, 'utf8', 'hex');
        cipherText += cipher.final('hex');

        return {
            iv: new Buffer(iv, 'binary').toString('hex'),
            sCipherText: cipherText
        };
    }

    static tripledesDecrypt(cipherText, key, iv) {
        const ivClone = Object.clone(iv);

        iv = new Buffer(iv, 'hex').toString('binary');

        cipherText = new Buffer(cipherText, 'hex').toString('binary');

        const decipher = crypto.createDecipheriv('des-ede3-cfb8', key, iv);
        let plainText = decipher.update(cipherText, 'binary', 'utf8');
        plainText += decipher.final('utf8');

        return {
            sIv: ivClone,
            sPlainText: plainText
        };
    };


	static _getSequenceAndTimestamp() {
        const presentTime = new Date().getTime();

        if (pastTime === presentTime) {
            ++sequence;

            return { sequence: sequence, timestamp: presentTime };
        }

        pastTime = presentTime;
        sequence = 1;

        return { sequence: sequence, timestamp: presentTime };
    }

    static getIdentifier() {
        if (cipherText) return cipherText;

        const parking = Identifier._getSequenceAndTimestamp();
        const sequence = parking.sequence;
        const timestamp = parking.timestamp;
        const hostname = os.hostname();
        const pid = process.pid;
        const plainText = `${timestamp}${hostname}${pid}${sequence}`;
        const hash = crypto.createHash('sha1');

        hash.update(plainText, 'utf8');
        cipherText = hash.digest('hex');

        return cipherText;
    }
}

module.exports = Identifier;
