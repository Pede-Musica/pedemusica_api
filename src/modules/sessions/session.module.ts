import { Module } from "@nestjs/common";
import { SessionController } from "./controllers/session.controller";
import { SessionService } from "./services/session.service";
import { PrismaService } from "src/common/infra/database/prisma.service";

@Module({
    imports: [],
    controllers: [SessionController],
    providers: [PrismaService, SessionService],
    exports: [],
})
export class SessionModule { }