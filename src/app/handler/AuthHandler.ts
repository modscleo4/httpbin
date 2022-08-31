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
import { HTTPError } from "apiframework/errors";
import { Hash } from "apiframework/hash";
import { EStatusCode, Handler, Request, Response } from "apiframework/http";
import { generateUUID } from "apiframework/util/uuid.js";

import UserDAO from "@core/dao/UserDAO.js";
import { Auth } from "apiframework/auth";

export default class AuthHandler extends Handler {
    #hash: Hash;
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#hash = server.providers.get('Hash');
        this.#auth = server.providers.get('Auth');
    }

    async register(req: Request): Promise<Response> {
        if (!req.parsedBody.username || !req.parsedBody.password) {
            throw new HTTPError("Invalid request.", EStatusCode.BAD_REQUEST);
        }

        const user = await UserDAO.get({
            where: {
                username: req.parsedBody.username
            }
        });

        if (user) {
            throw new HTTPError("Username already taken.", EStatusCode.BAD_REQUEST);
        }

        const password = this.#hash.hash(req.parsedBody.password);

        await UserDAO.create({
            id: generateUUID(),
            username: req.parsedBody.username,
            password,
        });

        return Response.status(EStatusCode.CREATED);
    }

    async user(req: Request): Promise<Response> {
        // Since the AuthBearer middleware is used, the user is already authenticated
        const user = this.#auth.user(req)!;

        return Response.json({user, jwt: req.container.get('jwt')});
    }

    async handle(req: Request): Promise<Response> {
        if (req.path === '/auth/register/') {
            return await this.register(req);
        } else if (req.path === '/auth/user/') {
            return await this.user(req);
        }

        return Response.status(EStatusCode.NOT_FOUND);
    }
}
