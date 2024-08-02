import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { MaterialService } from './material.service';
import { MaterialCreateDTO } from './dto/material-create.dto';
import { MaterialPaginateDTO } from './dto/material-paginate.dto';
import { MaterialDetailDTO } from './dto/material-detail.dto';

@Controller('material')
export class MaterialController {

    constructor(
        public readonly materialService: MaterialService
    ) {}

    @Get('/paginate')
    async paginate(@Query() params: MaterialPaginateDTO) {
        return await this.materialService.paginate(params)
    }

    @Post('/create')
    async create(@Body() data: MaterialCreateDTO,  @User() user_id: string) {
        return await this.materialService.create(data, user_id)
    }

    @Get('/detail/:id')
    async detail(@Param() data: MaterialDetailDTO) {
        return await this.materialService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: MaterialCreateDTO,  @User() user_id: string) {
        return await this.materialService.update(data, user_id)
    }

    @Get('/combolist')
    async combolist() {
        return await this.materialService.combolist()
    }
}
