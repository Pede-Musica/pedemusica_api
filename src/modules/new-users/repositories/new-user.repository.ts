import { Injectable } from "@nestjs/common";
import { INewUserRepository } from "./new-user.repository.interface";
import { PrismaService } from "src/common/infra/database/prisma.service";
import { Prisma, NewUser } from "@prisma/client";


@Injectable()
export class NewUserRepository implements INewUserRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: Prisma.NewUserCreateInput): Promise<NewUser> {
        return this.prismaService.newUser.create({
            data
        });
    }

    findByToken(token: string): Promise<NewUser | null> {
        return this.prismaService.newUser.findUnique({
            where: {
                token
            }
        });
    }

    async deleteMany(where?: Prisma.NewUserWhereInput): Promise<Prisma.BatchPayload> {
        return this.prismaService.newUser.deleteMany({
            where
        });
    }
}