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

import { Handler, Request, Response } from "apiframework/http";
import { HTTPError } from "apiframework/errors";
import { Payload } from "apiframework/util/jwt.js";
import { generateUUID } from "apiframework/util/uuid.js";
import { Server } from "apiframework/app";
import { Hash } from "apiframework/hash";
import { JWT } from "apiframework/jwt";

import User from "../entity/User.js";

export default class Oauth2Handler extends Handler {
    private jwt: JWT;
    private hash: Hash;

    constructor(server: Server) {
        super(server);

        this.hash = server.providers.get('Hash');
        this.jwt = server.providers.get('JWT');
    }

    async handlePasswordGrant(req: Request): Promise<Response> {
        if (!req.parsedBody.username || !req.parsedBody.password) {
            throw new HTTPError("Invalid request.", 401);
        }

        const user = await User.get({
            where: {
                username: req.parsedBody.username
            }
        });

        if (!user) {
            throw new HTTPError("Wrong username or password.", 401);
        }

        if (!this.hash.verify(user.password, req.parsedBody.password)) {
            throw new HTTPError("Wrong username or password.", 401);
        }

        const scope = req.parsedBody.scope || "";

        const issuedAt = Date.now();
        const expires = 1000 * 60 * 60 * 1; // 1 hour

        const data: (Payload & { username: string, scopes: string[]; }) = {
            iss: "http://localhost:3000",
            sub: user.id,
            exp: Math.ceil((issuedAt + expires) / 1000),
            iat: Math.floor(issuedAt / 1000),
            jti: generateUUID(),

            username: user.username,
            scopes: scope.split(' '),
        };

        const jwt = this.jwt.sign(data);

        return Response.json({
            access_token: jwt,
            expires_in: expires / 1000,
            token_type: 'Bearer',
            scope,
        }).withStatus(201);
    }

    async handleRefreshTokenGrant(req: Request): Promise<Response> {
        throw new HTTPError("Invalid request.", 400);
    }

    async handle(req: Request): Promise<Response> {
        if (!req.parsedBody || !req.parsedBody.grant_type) {
            throw new HTTPError("Invalid request.", 400);
        }

        switch (req.parsedBody.grant_type) {
            case 'password':
                return await this.handlePasswordGrant(req);
            case 'refresh_token':
                return await this.handleRefreshTokenGrant(req);
        }

        throw new HTTPError("Invalid request.", 400);
    }
}
