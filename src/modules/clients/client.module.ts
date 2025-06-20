import { Module } from "@nestjs/common";
import { PrismaService } from "src/common/infra/database/prisma.service";
import { ClientRepository } from "./repositories/client.repository";

@Module({
    imports: [],
    controllers: [],
    providers: [PrismaService, ClientRepository],
    exports: [],
})
export class ClientModule { }