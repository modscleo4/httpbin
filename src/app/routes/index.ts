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

import { Router as RouterBuilder } from "midori/router";
import { Response } from "midori/http";

import Oauth2Handler from "@app/handler/Oauth2Handler.js";
import * as BinHandler from "@app/handler/BinHandler.js";
import * as AuthHandler from "@app/handler/AuthHandler.js";
import InfoHandler from "@app/handler/InfoHandler.js";

import { addSwaggerRoutes } from "midori-swaggerui";

import AuthBearerMiddleware from "@app/middleware/AuthBearerMiddleware.js";
import OauthScopeMiddlewareFactory from "@app/middleware/OauthScopeMiddleware.js";

const OauthScopeWriteBinMiddleware = OauthScopeMiddlewareFactory({ scopes: ['write:bins'] });
const OauthScopeDeleteBinMiddleware = OauthScopeMiddlewareFactory({ scopes: ['delete:bins'] });

const Router = new RouterBuilder();

/**
 * Routing
 *
 * Define your routes here
 * Use the Router.get(), Router.post(), Router.put(), Router.patch(), Router.delete() methods to define your routes..
 * Use the Router.group() method to group routes under a common prefix.
 * Use the Router.route() method to define a route using a custom HTTP method.
 *
 * Beware of trailing slashes! The Dispatcher Middleware will NOT remove nor add trailing slashes to the request path
 * `GET /foo` and `GET /foo/` are different routes and will be dispatched to different handlers.
 *
 * You can add an parameter to the path by using the {parameterName} syntax. The parameter will be available in the params property of the Request.
 *
 * Example:
 * Router.get('/user/{id}', UserHandler.Show).withName('user.show');
 */

addSwaggerRoutes(Router);
Router.get('/', InfoHandler);

Router.post('/auth/register', AuthHandler.Register).withName('auth.register');
Router.get('/auth/user', AuthHandler.User, [AuthBearerMiddleware]).withName('auth.user');

Router.post('/oauth/token', Oauth2Handler).withName('oauth.token');

Router.group('/bin', () => {
    Router.get('', BinHandler.List).withName('bin.list');
    Router.post('', BinHandler.Create, [AuthBearerMiddleware, OauthScopeWriteBinMiddleware]).withName('bin.create');

    Router.group('/{id}', () => {
        Router.get('', BinHandler.Show).withName('bin.show');
        Router.put('', BinHandler.Update, [AuthBearerMiddleware, OauthScopeWriteBinMiddleware]).withName('bin.update');
        Router.patch('', BinHandler.Patch, [AuthBearerMiddleware, OauthScopeWriteBinMiddleware]).withName('bin.patch');
        Router.delete('', BinHandler.Destroy, [AuthBearerMiddleware, OauthScopeDeleteBinMiddleware]).withName('bin.destroy');
    });
});

export default Router;
