import { Server } from "apiframework/app";
import { HTTPError } from "apiframework/errors";
import { Hash } from "apiframework/hash";
import { Handler, Request, Response } from "apiframework/http";
import { generateUUID } from "apiframework/util/uuid.js";

import User from "../entity/User.js";

export default class AuthHandler extends Handler {
    private hash: Hash;

    constructor(server: Server) {
        super();

        this.hash = server.providers.get('Hash');
    }

    async register(req: Request): Promise<Response> {
        if (!req.parsedBody.username || !req.parsedBody.password) {
            throw new HTTPError("Invalid request.", 400);
        }

        const user = await User.get({
            where: {
                username: req.parsedBody.username
            }
        });

        if (user) {
            throw new HTTPError("Username already taken.", 400);
        }

        const password = this.hash.hash(req.parsedBody.password);

        await User.create({
            id: generateUUID(),
            username: req.parsedBody.username,
            password,
        });

        return Response.status(201);
    }

    async handle(req: Request): Promise<Response> {
        if (req.path === '/auth/register/') {
            return await this.register(req);
        }

        return Response.status(404);
    }
}
