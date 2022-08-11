import { Handler, Request, Response } from "apiframework/http";
import { HTTPError } from "apiframework/errors";
import { generateUUID } from "apiframework/util/uuid.js";

import Bin from "../model/Bin.js";

export default class BinHandler extends Handler {
    async get(req: Request): Promise<Response> {
        const data = await Bin.all();

        return Response.json(data);
    }

    async post(req: Request): Promise<Response> {
        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", 400);
        }

        const id = generateUUID();

        const data = {
            id,
            username: req.jwt!.sub,
            content: req.parsedBody
        };

        const saved = await Bin.create(data);
        if (!saved) {
            throw new HTTPError("Failed to save bin.", 500);
        }

        return Response.json(data).withStatus(201);
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
