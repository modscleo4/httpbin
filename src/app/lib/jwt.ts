import { configJWT, JWTAlgorithm } from 'apiframework/util/jwt.js';
import { readFileSync } from 'fs';

const jwt = {
    alg: process.env.JWT_ALGORITHM || 'HS256',

    secret: process.env.JWT_SECRET,
    publicKey: process.env.JWT_PUBLIC_KEY,
    privateKey: process.env.JWT_PRIVATE_KEY,
};

export function initJWT() {
    const alg = JWTAlgorithm[jwt.alg as keyof typeof JWTAlgorithm];
    const secret = jwt.secret || 'secret';
    const publicKey = jwt.publicKey ? readFileSync(jwt.publicKey, { encoding: 'utf8' }) : undefined;
    const privateKey = jwt.privateKey ? readFileSync(jwt.privateKey, { encoding: 'utf8' }) : undefined;

    configJWT(alg, ([JWTAlgorithm.HS256, JWTAlgorithm.HS384, JWTAlgorithm.HS512].includes(alg) ? secret : privateKey) || 'secret');
}
