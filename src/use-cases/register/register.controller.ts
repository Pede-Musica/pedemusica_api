import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { RegisterService } from './register.service';
import { EntryCreateDTO } from './dto/entry-create.dto';
import { RegisterPaginateDTO } from './dto/register-list.dto';
import { RegisterDetailDTO } from './dto/register-detail.dto';
import { ExitCreateDTO } from './dto/exit.create.dto';

@Controller('register')
export class RegisterController {

    constructor(
        public readonly registerService: RegisterService
    ) {}

    @Post('/entry')
    async createEntry(@Body() data: EntryCreateDTO,  @User() user_id: string) {
        return await this.registerService.createEntry(data, user_id)
    }

    @Post('/exit')
    async createExit(@Body() data: ExitCreateDTO,  @User() user_id: string) {
        return await this.registerService.createExit(data, user_id)
    }

    @Post('/exit/close')
    async closeExit(@Body() data: { exit_id: number,  date: any },  @User() user_id: string) {
        return await this.registerService.closeExit(data, user_id)
    }

    @Get('/paginate')
    async getRegister(@Query() data: RegisterPaginateDTO) {
        return await this.registerService.getRegister(data);
    }

    @Get('/detail/:id')
    async detail(@Param() data: RegisterDetailDTO) {
        return await this.registerService.detail(data)
    }

    @Get('/exit/detail/:id')
    async detailExit(@Param() data: { id: string }) {
        return await this.registerService.detailExit(data)
    }

    @Get('/exit')
    async list() {
        return await this.registerService.listExit();
    }
}
