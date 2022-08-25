import dotenv from 'dotenv';

import { Server } from "apiframework/app";

import { prisma } from './app/lib/Prisma.js';
import pipeline from './pipeline.js';
import providers from './providers.js';

dotenv.config({ override: true });
dotenv.config({ path: './.env.dev', override: true });

export const server = new Server();

providers(server);
pipeline(server);

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
