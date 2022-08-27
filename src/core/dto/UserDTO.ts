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

import { Prisma } from "@prisma/client";

import { prisma } from "@core/lib/Prisma.js";
import { User } from "@core/entity/User.js";

export default class UserDTO {
    static async all(args?: Prisma.UserFindManyArgs): Promise<User[]> {
        return await prisma.user.findMany(args);
    }

    static async create(data: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({
            data
        });
    }

    static async get(args: Prisma.UserFindFirstArgs): Promise<User | null> {
        return await prisma.user.findFirst(args);
    }

    static async save(id: string, { username }: { username: string; }): Promise<User> {
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                username,
            }
        });
    }

    static async delete(id: string): Promise<User> {
        return await prisma.user.delete({
            where: {
                id
            }
        });
    }
}
