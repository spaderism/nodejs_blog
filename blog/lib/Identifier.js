'use strict';

const crypto = require('crypto');
const os = require('os');
let sequence = 1;
let pastTime = null;
let cipherText;

class Identifier {
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
