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

import { Prisma } from '@prisma/client';
import { prisma } from '../lib/Prisma.js';

export default class Bin {
    static async all(args?: Prisma.BinFindManyArgs) {
        return await prisma.bin.findMany(args);
    }

    static async create(data: Prisma.BinCreateInput) {
        return await prisma.bin.create({
            data
        });
    }

    static async get(args: Prisma.BinFindFirstArgs) {
        return await prisma.bin.findFirst(args);
    }

    static async save(id: string, { user_id, content }: { user_id: string, content: any }) {
        return await prisma.bin.update({
            where: {
                id
            },
            data: {
                user_id,
                content
            }
        });
    }

    static async delete(id: string) {
        return await prisma.bin.delete({
            where: {
                id
            }
        });
    }
}
