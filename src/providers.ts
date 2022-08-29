/**
 * Copyright 2022 Dhiego Cassiano Fogaça Barbosa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Server } from "apiframework/app";
import { Auth } from "apiframework/auth";
import { Scrypt } from "apiframework/hash";
import { JWT } from "apiframework/jwt";
import { ConsoleLogger, LogLevel } from "apiframework/log";

import PrismaUserProvider from "@app/providers/PrismaUserProvider.js";

import router from '@app/routes/index.js';

export default function providers(server: Server): void {
    server.install('Router', router);
    server.install('Logger', new ConsoleLogger({ colorsEnabled: true, minLevel: LogLevel.DEBUG }));

    // Add providers here
    // Recover the provider with server.providers.get('ProviderName') in your handlers and middleware constructors
    server.install('JWT', new JWT(process.env.JWT_ALGORITHM || 'HS256', process.env.JWT_SECRET || 'secret', process.env.JWT_PUBLIC_KEY, process.env.JWT_PRIVATE_KEY));
    server.install('Hash', new Scrypt());
    server.install('User', new PrismaUserProvider(server));
    server.install('Auth', new Auth(server));
}
