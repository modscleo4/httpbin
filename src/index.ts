import dotenv from 'dotenv';

dotenv.config({ path: './.env.dev', override: true });
dotenv.config({ override: true });

import router from './app/routes/index.js';
import { Server } from "apiframework/http";
import { prisma } from './app/lib/Prisma.js';
import { ConsoleLogger } from 'apiframework/log';

const server = new Server({
    router,
    logger: new ConsoleLogger(),
});

const port = parseInt(process.env.PORT || '3000');

server.listen(port).on('listening', async () => {
    console.log(`Server is running on port ${port}`);
    await prisma.$connect();
}).on('close', async () => {
    await prisma.$disconnect();
});
