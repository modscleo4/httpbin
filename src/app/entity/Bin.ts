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
