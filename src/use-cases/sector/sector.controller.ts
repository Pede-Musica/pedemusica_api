import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SectorService } from './sector.service';
import { SectorPaginateDTO } from './dto/sector-paginate.dto';
import { SectorCreateDTO } from './dto/sector-create.dto';
import { User } from 'src/decorators/user.decorator';
import { SectorDetailDTO } from './dto/sector-detail.dto';

@Controller('sector')
export class SectorController {

    constructor(
        public sectorService: SectorService
    ) {}

    @Get('/paginate')
    async paginate(@Query() params: SectorPaginateDTO) {
        return await this.sectorService.paginate(params)
    }

    @Post('/create')
    async create(@Body() data: SectorCreateDTO,  @User() user_id: string) {
        return await this.sectorService.create(data, user_id)
    }

    @Get('/detail/:id')
    async detail(@Param() data: SectorDetailDTO) {
        return await this.sectorService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: SectorCreateDTO,  @User() user_id: string) {
        return await this.sectorService.update(data, user_id)
    }

    @Get('/combolist')
    async combolist() {
        return await this.sectorService.combolist();
    }
}
