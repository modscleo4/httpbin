import { Handler, Request, Response } from "apiframework/http";
import { HTTPError } from "apiframework/errors";
import { generateJWT, Payload } from "apiframework/util/jwt.js";
import { generateUUID } from "apiframework/util/uuid.js";

export default class Oauth2Handler extends Handler {
    async handlePasswordGrant(req: Request): Promise<Response> {
        if (!req.parsedBody.username || !req.parsedBody.password) {
            throw new HTTPError("Invalid request.", 401);
        }

        const scope = req.parsedBody.scope || "";

        const issuedAt = Date.now();
        const expires = 1000 * 60 * 60 * 1; // 1 hour

        const data: (Payload & { scopes: string[]; }) = {
            iss: "http://localhost:3000",
            sub: req.parsedBody.username,
            exp: Math.ceil((issuedAt + expires) / 1000),
            iat: Math.floor(issuedAt / 1000),
            jti: generateUUID(),

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
