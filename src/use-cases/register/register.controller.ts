import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { RegisterService } from './register.service';
import { EntryCreateDTO } from './dto/entry-create.dto';
import { RegisterPaginateDTO } from './dto/register-list.dto';

@Controller('register')
export class RegisterController {

    constructor(
        public readonly registerService: RegisterService
    ) {}

    @Post('/entry')
    async createEntry(@Body() data: EntryCreateDTO,  @User() user_id: string) {
        return await this.registerService.createEntry(data, user_id)
    }

    @Get('/paginate')
    async getRegister(@Query() data: RegisterPaginateDTO) {
        return await this.registerService.getRegister(data);
    }
}
