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

export default class BinByIdHandler extends Handler {
    #auth: Auth;

    constructor(server: Server) {
        super(server);

        this.#auth = server.providers.get('Auth');
    }

    async get(req: Request): Promise<Response> {
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

    async put(req: Request): Promise<Response> {
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

    async patch(req: Request): Promise<Response> {
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

    async delete(req: Request): Promise<Response> {
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

    async handle(req: Request): Promise<Response> {
        switch (req.method) {
            case 'GET':
                return await this.get(req);

            case 'PUT':
                return await this.put(req);

            case 'PATCH':
                return await this.patch(req);

            case 'DELETE':
                return await this.delete(req);
        }

        return Response.status(EStatusCode.METHOD_NOT_ALLOWED);
    }
}
