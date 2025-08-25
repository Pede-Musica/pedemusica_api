import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/auth-guard.decorator';
import { RequestCreateDTO } from './dto/request-create.dto';
import { RequestService } from './request.service';
import { RequestPaginateDTO } from './dto/request-paginate.dto';
import { RequestUpdateFavoriteDTO } from './dto/request-update-favorite.dto';

@Controller('request')
export class RequestController {

    constructor(
        private requestService: RequestService
    ) {}

    @Public()
    @Post('/create')
    async create(@Body() data: RequestCreateDTO) {
        return await this.requestService.create(data)
    }

    @Get('/paginate')
    async paginate(@Query() data: RequestPaginateDTO) {
        return await this.requestService.paginate(data)
    }

    @Post('/update')
    async update(@Body() data: RequestUpdateFavoriteDTO) {
        return await this.requestService.update(data)
    }
}
