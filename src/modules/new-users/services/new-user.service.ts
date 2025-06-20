import { Injectable } from "@nestjs/common";
import { NewUserRepository } from "../repositories/new-user.repository";
import { Prisma } from "@prisma/client";


@Injectable()
export class NewUserService {
    constructor(private readonly newUserRepository: NewUserRepository) { }

    async create(data: Prisma.NewUserCreateInput) {
        return this.newUserRepository.create(data);
    }

    async findByToken(token: string) {
        return this.newUserRepository.findByToken(token);
    }

    async deleteMany(where?: Prisma.NewUserWhereInput) {
        return this.newUserRepository.deleteMany(where);
    }
}