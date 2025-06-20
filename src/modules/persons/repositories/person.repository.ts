import { Injectable } from "@nestjs/common";
import { IPersonRepository } from "./person.repository.interface";
import { PrismaService } from "src/common/infra/database/prisma.service";
import { Prisma, Person } from "@prisma/client";


@Injectable()
export class PersonRepository implements IPersonRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async create(data: Prisma.PersonCreateInput): Promise<Person> {
        return this.prismaService.person.create({
            data
        });
    }
}