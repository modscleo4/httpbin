import { Handler, Request, Response } from "apiframework/http";
import { HTTPError } from "apiframework/errors";
import { generateJWT, Payload } from "apiframework/util/jwt.js";
import { generateUUID } from "apiframework/util/uuid.js";
import User from "../entity/User.js";
import { Server } from "apiframework/app";

export default class Oauth2Handler extends Handler {
    async handlePasswordGrant(req: Request, server: Server): Promise<Response> {
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

        if (!server.hash.verify(user.password, req.parsedBody.password)) {
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

        const jwt = generateJWT(data);

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

    async handle(req: Request, server: Server): Promise<Response> {
        if (!req.parsedBody || !req.parsedBody.grant_type) {
            throw new HTTPError("Invalid request.", 400);
        }

        switch (req.parsedBody.grant_type) {
            case 'password':
                return await this.handlePasswordGrant(req, server);
            case 'refresh_token':
                return await this.handleRefreshTokenGrant(req);
        }

        throw new HTTPError("Invalid request.", 400);
    }
}
