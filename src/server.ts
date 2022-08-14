import dotenv from 'dotenv';
import { readFileSync } from 'fs';

import { Server } from "apiframework/app";
import { ConsoleLogger, LogLevel } from 'apiframework/log';
import { configJWT, JWTAlgorithm } from 'apiframework/util/jwt.js';

import router from './app/routes/index.js';
import { prisma } from './app/lib/Prisma.js';

dotenv.config({ path: './.env.dev', override: true });
dotenv.config({ override: true });

const jwt = {
    alg: process.env.JWT_ALGORITHM || 'HS256',

    secret: process.env.JWT_SECRET || '',
    publicKey: process.env.JWT_PUBLIC_KEY && readFileSync(process.env.JWT_PUBLIC_KEY, { encoding: 'utf8' }),
    privateKey: process.env.JWT_PRIVATE_KEY && readFileSync(process.env.JWT_PRIVATE_KEY, { encoding: 'utf8' }),
};

configJWT(JWTAlgorithm[jwt.alg as keyof typeof JWTAlgorithm], ['HS256', 'HS384', 'HS512'].includes(jwt.alg) ? jwt.secret : ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'PS256', 'PS384', 'PS512'].includes(jwt.alg) ? jwt.privateKey || '' : '');

export const server = new Server({
    providers: {
        router,
        logger: new ConsoleLogger({ minLevel: LogLevel.DEBUG }),
    },
});

const port = parseInt(process.env.PORT || '3000');

await new Promise<void>((resolve, reject) => {
    server.listen(port).on('listening', async () => {
        console.log(`Server is running on port ${port}`);
        await prisma.$connect();
        resolve();
    }).on('close', async () => {
        await prisma.$disconnect();
    });
});
