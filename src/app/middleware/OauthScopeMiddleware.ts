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

import { HTTPError } from "apiframework/errors";
import { Middleware, Request, Response } from "apiframework/http";
import { Constructor } from "apiframework/util/types.js";

export default function OauthScopeMiddleware(options: { scopes: string[]; }): Constructor<Middleware> {
    return class extends Middleware {
        async process(req: Request, next: (req: Request) => Promise<Response>): Promise<Response> {
            if (req.container.get('jwt')) {
                const userScopes = req.container.get('jwt').scopes ?? [];
                for (const scope of options.scopes) {
                    if (!userScopes.includes(scope)) {
                        throw new HTTPError(`Insufficient permissions: ${scope}`, 403);
                    }
                }
            }

            return await next(req);
        }
    };
}
