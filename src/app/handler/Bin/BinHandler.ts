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

import { EStatusCode, Handler, Request, Response } from "apiframework/http";
import { HTTPError } from "apiframework/errors";
import { generateUUID } from "apiframework/util/uuid.js";

import { Prisma } from "@prisma/client";

import BinDTO from "@core/dto/BinDTO.js";
import { Auth } from "apiframework/auth";
import { Server } from "apiframework/app";

export default class BinHandler extends Handler {
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#auth = server.providers.get('Auth');
    }

    async get(req: Request): Promise<Response> {
        const data = await BinDTO.all();

        return Response.json(data);
    }

    async post(req: Request): Promise<Response> {
        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", EStatusCode.BAD_REQUEST);
        }

        const id = generateUUID();

        // Since the AuthBearer middleware is used, the user is already authenticated
        const user = this.#auth.user(req)!;

        const data: Prisma.BinCreateInput = {
            id,
            user: {
                connect: { id: user.id },
            },
            content: req.parsedBody
        };

        const saved = await BinDTO.create(data);
        if (!saved) {
            throw new HTTPError("Failed to save bin.", EStatusCode.INTERNAL_SERVER_ERROR);
        }

        return Response.json(saved).withStatus(EStatusCode.CREATED);
    }

    async handle(req: Request): Promise<Response> {
        switch (req.method) {
            case 'GET':
                return await this.get(req);

            case 'POST':
                return await this.post(req);
        }

        return Response.status(EStatusCode.METHOD_NOT_ALLOWED);
    }
}
