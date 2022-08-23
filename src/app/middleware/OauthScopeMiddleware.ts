import { HTTPError } from "apiframework/errors";
import { Middleware, Request, Response } from "apiframework/http";
import { Constructor } from "apiframework/util/types.js";

export default function OauthScopeMiddleware(scopes: string[]): Constructor<Middleware> {
    return class extends Middleware {
        async process(req: Request, next: (req: Request) => Promise<Response>): Promise<Response> {
            if (req.container.get('jwt')) {
                const userScopes = req.container.get('jwt').scopes ?? [];
                for (const scope of scopes) {
                    if (!userScopes.includes(scope)) {
                        throw new HTTPError(`Insufficient permissions: ${scope}`, 403);
                    }
                }
            }

            return await next(req);
        }
    };
}
