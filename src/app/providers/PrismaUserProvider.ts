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

import { User, UserProvider } from "apiframework/auth";
import { Hash } from "apiframework/hash";
import { Server } from "apiframework/app";

import UserDAO from "@core/dao/UserDAO.js";

export default class PrismaUserProvider extends UserProvider {
    #hash: Hash;

    constructor(server: Server) {
        super();

        this.#hash = server.providers.get('Hash');
    }

    async getUserById(id: string): Promise<User | null> {
        return await UserDAO.get({ select: { id: true, username: true }, where: { id } });
    }

    async getUserByCredentials(username: string, password: string): Promise<User | null> {
        const user = await UserDAO.get({ select: { id: true, username: true, password: true }, where: { username } });

        if (!user) {
            return null;
        }

        if (!this.#hash.verify(user.password, password)) {
            return null;
        }

        return {
            id: user.id,
            username: user.username,
        };
    }
}
