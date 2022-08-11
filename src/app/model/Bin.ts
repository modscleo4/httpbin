import { Prisma } from '@prisma/client';
import { prisma } from '../lib/Prisma.js';

export default class Bin {
    static async all() {
        return await prisma.bins.findMany();
    }

    static async create(data: Prisma.binsCreateInput) {
        return await prisma.bins.create({
            data
        });
    }

    static async get(id: string) {
        return await prisma.bins.findFirst({
            where: {
                id
            }
        });
    }

    static async save(id: string, { content }: { content: any }) {
        return await prisma.bins.update({
            where: {
                id
            },
            data: {
                content
            }
        });
    }

    static async delete(id: string) {
        return await prisma.bins.delete({
            where: {
                id
            }
        });
    }
}
