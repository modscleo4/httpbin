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
