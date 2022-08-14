import crypto from 'crypto';
import { writeFileSync } from 'fs';

function generateKeypair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        namedCurve: 'secp521r1',
        publicKeyEncoding: {
            format: 'pem',
            type: 'spki'
        },
        privateKeyEncoding: {
            format: 'pem',
            type: 'pkcs8',
        }
    });
}

const { publicKey, privateKey } = generateKeypair();

console.log(publicKey);
console.log(privateKey);

writeFileSync('./keys/public.pem', publicKey, { encoding: 'utf8' });
writeFileSync('./keys/private.pem', privateKey, { encoding: 'utf8' });
