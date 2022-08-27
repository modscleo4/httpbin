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
import { generateUUID } from "apiframework/util/uuid.js";
import { Payload } from "apiframework/util/jwt.js";

import { Prisma } from "@prisma/client";

import BinDTO from "@core/dto/BinDTO.js";

export default class BinHandler extends Handler {
    async get(req: Request): Promise<Response> {
        const data = await BinDTO.all();

        return Response.json(data);
    }

    async post(req: Request): Promise<Response> {
        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", 400);
        }

        const id = generateUUID();

        const jwt: Payload = req.container.get('jwt');

        const data: Prisma.BinCreateInput = {
            id,
            user: {
                connect: { id: jwt!.sub },
            },
            content: req.parsedBody
        };

        const saved = await BinDTO.create(data);
        if (!saved) {
            throw new HTTPError("Failed to save bin.", 500);
        }

        return Response.json(saved).withStatus(201);
    }

    async handle(req: Request): Promise<Response> {
        switch (req.method) {
            case 'GET':
                return await this.get(req);

            case 'POST':
                return await this.post(req);
        }

        return Response.status(405);
    }
}
