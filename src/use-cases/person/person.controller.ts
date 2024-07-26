import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonPaginateDTO } from './dto/person-paginate.dto';
import { PersonCreateDTO } from './dto/person-create.dto';
import { User } from 'src/decorators/user.decorator';
import { PersonDetailDTO } from './dto/person-detail.dto';

@Controller('person')
export class PersonController {

    constructor(
        public readonly personService: PersonService
    ) {}

    @Get('/paginate')
    async paginate(@Query() params: PersonPaginateDTO) {
        return await this.personService.paginate(params)
    }

    @Post('/create')
    async create(@Body() data: PersonCreateDTO,  @User() user_id: string) {
        return await this.personService.create(data, user_id)
    }

    @Get('/detail/:id')
    async detail(@Param() data: PersonDetailDTO) {
        return await this.personService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: PersonCreateDTO,  @User() user_id: string) {
        return await this.personService.update(data, user_id)
    }

}
