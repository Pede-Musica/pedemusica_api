import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/infra/database/prisma.service";

@Injectable()
export class SessionService {
    constructor(private readonly prismaService: PrismaService) { }

    async getSession(user_id: string) {
        return await this.prismaService.user.findUnique({
            where: { id: user_id },
            select: {
                id: true,
                email: true,
                client: {
                    select: {
                        id: true,
                        name: true,
                        logo: true
                    }
                }
            }
        });
    }
}