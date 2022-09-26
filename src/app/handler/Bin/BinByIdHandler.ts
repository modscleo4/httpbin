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

import BinDAO from "@core/dao/BinDAO.js";
import { Auth } from "apiframework/auth";
import { Server } from "apiframework/app";

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
