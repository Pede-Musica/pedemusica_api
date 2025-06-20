import { Injectable } from "@nestjs/common";
import { IClientRepository } from "./client.repository.interface";
import { PrismaService } from "src/common/infra/database/prisma.service";
import { Client } from "@prisma/client";


@Injectable()
export class ClientRepository implements IClientRepository {
    constructor(private readonly prismaService: PrismaService) { }

    async findMany(id: string): Promise<Client[] | null> {
        return await this.prismaService.client.findMany({
            where: {
                id: id
            }
        })
    }
}