import { Controller, Get } from "@nestjs/common";
import { SessionService } from "../services/session.service";
import { User } from "src/common/decorators/user.decorator";


@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) { }

    @Get()
    async getSession(@User() user_id: string) {
        return await this.sessionService.getSession(user_id);
    }
}