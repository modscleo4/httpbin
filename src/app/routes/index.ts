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

import { Router as RouterWrapper } from "apiframework/router";

import Oauth2Handler from "@app/handler/Oauth2Handler.js";
import BinHandler from "@app/handler/Bin/BinHandler.js";
import BinByIdHandler from "@app/handler/Bin/BinByIdHandler.js";
import AuthHandler from "@app/handler/AuthHandler.js";
import InfoHandler from "@app/handler/InfoHandler.js";

import { AuthBearerMiddleware } from "apiframework/middlewares";
import OauthScopeMiddleware from "@app/middleware/OauthScopeMiddleware.js";

const OauthScopeMiddlewareBin = OauthScopeMiddleware({ scopes: ['bin'] });

const Router = new RouterWrapper();

/**
 * Routing
 *
 * Define your routes here
 * Use the Router.get(), Router.post(), Router.put(), Router.patch(), Router.delete() methods to define your routes
 * Use the Router.group() method to group routes under a common prefix
 * Use the Router.usePublicPath() method to define a public path to serve static files from
 */

Router.get('/', InfoHandler);

Router.post('/auth/register', AuthHandler).withName('auth.register');
Router.get('/auth/user', AuthHandler, [AuthBearerMiddleware]).withName('auth.user');

Router.post('/oauth/token', Oauth2Handler).withName('oauth.token');

Router.group('/bin', () => {
    Router.get('/', BinHandler).withName('bin.list');
    Router.post('/', BinHandler, [AuthBearerMiddleware, OauthScopeMiddlewareBin]).withName('bin.create');

    Router.group('/{id}', () => {
        Router.get('/', BinByIdHandler).withName('bin.get');
        Router.put('/', BinByIdHandler, [AuthBearerMiddleware, OauthScopeMiddlewareBin]).withName('bin.update');
        Router.patch('/', BinByIdHandler, [AuthBearerMiddleware, OauthScopeMiddlewareBin]).withName('bin.patch');
        Router.delete('/', BinByIdHandler, [AuthBearerMiddleware, OauthScopeMiddlewareBin]).withName('bin.delete');
    });
});

export default Router;
