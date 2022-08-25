import { Server } from "apiframework/app";
import { Scrypt } from "apiframework/hash";
import { JWT } from "apiframework/jwt";
import { ConsoleLogger, LogLevel } from 'apiframework/log';

import router from './app/routes/index.js';

export default function providers(server: Server): void {
    server.install('Router', router);
    server.install('Logger', new ConsoleLogger({ minLevel: LogLevel.DEBUG }));

    // Add providers here
    // Recover the provider with server.providers.get('ProviderName') in your handlers and middleware constructors
    server.install('JWT', new JWT(process.env.JWT_ALGORITHM || 'HS256', process.env.JWT_SECRET || 'secret', process.env.JWT_PUBLIC_KEY, process.env.JWT_PRIVATE_KEY));
    server.install('Hash', new Scrypt());
}