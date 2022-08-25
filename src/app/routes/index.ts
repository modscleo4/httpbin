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

import { Router as RouterWrapper } from 'apiframework/router';

import Oauth2Handler from '../handler/Oauth2Handler.js';
import BinHandler from '../handler/Bin/BinHandler.js';
import BinByIdHandler from '../handler/Bin/BinByIdHandler.js';

import { AuthBearerMiddleware } from 'apiframework/middlewares';
import AuthHandler from '../handler/AuthHandler.js';
import OauthScopeMiddleware from '../middleware/OauthScopeMiddleware.js';
import InfoHandler from '../handler/InfoHandler.js';

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

Router.post('/oauth/token', Oauth2Handler).withName('oauth.token');

Router.group('/bin', () => {
    Router.get('/', BinHandler).withName('bin.list');
    Router.post('/', BinHandler, [AuthBearerMiddleware, OauthScopeMiddleware(['bin'])]).withName('bin.create');

    Router.group('/{id}', () => {
        Router.get('/', BinByIdHandler).withName('bin.get');
        Router.put('/', BinByIdHandler, [AuthBearerMiddleware, OauthScopeMiddleware(['bin'])]).withName('bin.update');
        Router.patch('/', BinByIdHandler, [AuthBearerMiddleware, OauthScopeMiddleware(['bin'])]).withName('bin.patch');
        Router.delete('/', BinByIdHandler, [AuthBearerMiddleware, OauthScopeMiddleware(['bin'])]).withName('bin.delete');
    });
});

export default Router;
