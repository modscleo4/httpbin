import { NextFunction } from "apiframework/http/Middleware.js";
import { Middleware, Request, Response } from "apiframework/http";
import { Payload, validateJWT } from "apiframework/util/jwt.js";

export default class AuthBearerMiddleware extends Middleware {
    async process(req: Request, next: NextFunction): Promise<Response> {
        if (!req.headers['authorization']) {
            return Response.json({ message: 'Invalid Authorization header.' })
                .withHeader('WWW-Authenticate', 'Bearer')
                .withStatus(401);
        }

        const header = req.headers['authorization'].split(' ', 2);
        const scheme = header[0];
        const credentials = header[1];

        if (scheme !== 'Bearer') {
            return Response.json({ message: 'Invalid Authorization scheme.' })
                .withHeader('WWW-Authenticate', 'Bearer')
                .withStatus(401);
        }

        if (!credentials || !validateJWT(credentials)) {
            return Response.json({ message: 'Invalid Authorization credentials.' })
                .withHeader('WWW-Authenticate', 'Bearer')
                .withStatus(401);
        }

        const [, payloadBase64] = credentials.split('.');

        const payload: Payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString());

        if (!(
            typeof payload === 'object'
            && payload.hasOwnProperty('exp')
            && payload.hasOwnProperty('iat')
        )) {
            return Response.json({ message: 'Invalid Authorization credentials.' })
                .withHeader('WWW-Authenticate', 'Bearer')
                .withStatus(401);
        }

        if (payload.exp * 1000 < Date.now()) {
            return Response.json({ message: 'Token has expired.' })
                .withHeader('WWW-Authenticate', 'Bearer')
                .withStatus(401);
        }

        req.jwt = payload;

        return await next(req);
    }
}
