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

import { PrismaDTO, prisma } from "@core/lib/Prisma.js";
import { Bin } from "@core/entity/Bin.js";
import { Prisma } from "@prisma/client";

export default class BinDAO {
    static async all(args?: PrismaDTO.BinFindManyArgs): Promise<Bin[]> {
        return await prisma.bin.findMany(args);
    }

    static async create(data: PrismaDTO.BinCreateInput): Promise<Bin> {
        return await prisma.bin.create({
            data
        });
    }

    static async get(args: PrismaDTO.BinFindFirstArgs): Promise<Bin | null> {
        return await prisma.bin.findFirst(args);
    }

    static async save(id: string, data: PrismaDTO.BinUpdateInput): Promise<Bin> {
        return await prisma.bin.update({
            where: {
                id
            },
            data
        });
    }

    static async delete(id: string): Promise<Bin> {
        return await prisma.bin.delete({
            where: {
                id
            }
        });
    }
}
