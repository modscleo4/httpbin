import { Prisma } from '@prisma/client';
import { prisma } from '../lib/Prisma.js';

export default class User {
    static async all(args?: Prisma.UserFindManyArgs) {
        return await prisma.user.findMany(args);
    }

    static async create(data: Prisma.UserCreateInput) {
        return await prisma.user.create({
            data
        });
    }

    static async get(args: Prisma.UserFindFirstArgs) {
        return await prisma.user.findFirst(args);
    }

    static async save(id: string, { username }: { username: string; }) {
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                username,
            }
        });
    }

    static async delete(id: string) {
        return await prisma.user.delete({
            where: {
                id
            }
        });
    }
}
