import { Handler, Request, Response } from "apiframework/http";
import { HTTPError } from "apiframework/errors";

import Bin from "../model/Bin.js";
import { Payload } from "apiframework/util/jwt.js";

export default class BinByIdHandler extends Handler {
    async get(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", 400);
        }

        const bin = await Bin.get(id);
        if (!bin) {
            throw new HTTPError('Bin not found.', 404);
        }

        return Response.json(bin);
    }

    async put(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", 400);
        }

        const bin = await Bin.get(id);

        if (!bin) {
            throw new HTTPError('Bin not found.', 404);
        }

        const jwt: Payload = req.container.get('jwt');

        if (bin.username !== jwt!.sub) {
            throw new HTTPError('You are not the owner of this bin.', 403);
        }

        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", 400);
        }

        bin.content = req.parsedBody;

        await Bin.save(bin.id, bin);

        return Response.json(bin);
    }

    async patch(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", 400);
        }

        const bin = await Bin.get(id);

        if (!bin) {
            throw new HTTPError('Bin not found.', 404);
        }

        const jwt: Payload = req.container.get('jwt');

        if (bin.username !== jwt!.sub) {
            throw new HTTPError('You are not the owner of this bin.', 403);
        }

        if (!req.parsedBody) {
            throw new HTTPError("Invalid body.", 400);
        }

        bin.content = req.parsedBody;

        await Bin.save(bin.id, bin);

        return Response.json(bin);
    }

    async delete(req: Request): Promise<Response> {
        const id = req.params.get('id');
        if (!id) {
            throw new HTTPError("Invalid ID.", 400);
        }

        const bin = await Bin.get(id);

        if (!bin) {
            throw new HTTPError('Bin not found.', 404);
        }

        const jwt: Payload = req.container.get('jwt');

        if (bin.username !== jwt!.sub) {
            throw new HTTPError('You are not the owner of this bin.', 403);
        }

        await Bin.delete(bin.id);

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

        return Response.status(405);
    }
}
