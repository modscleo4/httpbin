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

import { EStatusCode, Handler, Request, Response } from "midori/http";
import { HTTPError } from "midori/errors";
import { generateUUID } from "midori/util/uuid.js";

import { Prisma } from "@prisma/client";

import BinDAO from "@core/dao/BinDAO.js";
import { Auth } from "midori/auth";
import { Server } from "midori/app";

export class List extends Handler {
    async handle(req: Request): Promise<Response> {
        const data = await BinDAO.all();

        return Response.json(data);
    }
}

export class Create extends Handler {
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#auth = server.providers.get('Auth');
    }

    async handle(req: Request): Promise<Response> {
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

        const saved = await BinDAO.create(data);
        if (!saved) {
            throw new HTTPError("Failed to save bin.", EStatusCode.INTERNAL_SERVER_ERROR);
        }

        return Response.json(saved).withStatus(EStatusCode.CREATED);
    }
}

export class Show extends Handler {
    async handle(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", EStatusCode.BAD_REQUEST);
        }

        const bin = await BinDAO.get({
            where: {
                id
            }
        });

        if (!bin) {
            throw new HTTPError('Bin not found.', EStatusCode.NOT_FOUND);
        }

        return Response.json(bin);
    }
}

export class Update extends Handler {
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#auth = server.providers.get('Auth');
    }

    async handle(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", EStatusCode.BAD_REQUEST);
        }

        const bin = await BinDAO.get({
            where: {
                id
            }
        });

        if (!bin) {
            throw new HTTPError('Bin not found.', EStatusCode.NOT_FOUND);
        }

        // Since the AuthBearer middleware is used, the user is already authenticated
        const user = this.#auth.user(req)!;

        if (bin.user_id !== user.id) {
            throw new HTTPError('You are not the owner of this bin.', EStatusCode.FORBIDDEN);
        }

        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", EStatusCode.BAD_REQUEST);
        }

        bin.content = req.parsedBody;

        await BinDAO.save(bin.id, bin);

        return Response.json(bin);
    }
}

export class Patch extends Handler {
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#auth = server.providers.get('Auth');
    }

    async handle(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", EStatusCode.BAD_REQUEST);
        }

        const bin = await BinDAO.get({
            where: {
                id
            }
        });

        if (!bin) {
            throw new HTTPError('Bin not found.', EStatusCode.NOT_FOUND);
        }

        // Since the AuthBearer middleware is used, the user is already authenticated
        const user = this.#auth.user(req)!;

        if (bin.user_id !== user.id) {
            throw new HTTPError('You are not the owner of this bin.', EStatusCode.FORBIDDEN);
        }

        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", EStatusCode.BAD_REQUEST);
        }

        bin.content = req.parsedBody;

        await BinDAO.save(bin.id, bin);

        return Response.json(bin);
    }
}

export class Destroy extends Handler {
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#auth = server.providers.get('Auth');
    }

    async handle(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", EStatusCode.BAD_REQUEST);
        }

        const bin = await BinDAO.get({
            where: {
                id
            }
        });

        if (!bin) {
            throw new HTTPError('Bin not found.', EStatusCode.NOT_FOUND);
        }

        // Since the AuthBearer middleware is used, the user is already authenticated
        const user = this.#auth.user(req)!;

        if (bin.user_id !== user.id) {
            throw new HTTPError('You are not the owner of this bin.', EStatusCode.FORBIDDEN);
        }

        await BinDAO.delete(bin.id);

        return Response.empty();
    }
}
