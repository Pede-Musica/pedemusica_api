import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { LocationService } from './location.service';
import { LocationCreateDTO } from './dto/location-create.dto';
import { LocationDetailDTO } from './dto/location-detail.dto';
import { LocationPaginateDTO } from './dto/location-paginate.dto';
import { TrackDTO } from './dto/track.dto';

@Controller('location')
export class LocationController {

    constructor(
        public readonly locationService: LocationService
    ) {}

    @Get('/paginate')
    async paginate(@Query() params: LocationPaginateDTO) {
        return await this.locationService.paginate(params)
    }

    @Post('/create')
    async create(@Body() data: LocationCreateDTO,  @User() user_id: string) {
        return await this.locationService.create(data, user_id)
    }

    @Get('/detail/:id')
    async detail(@Param() data: LocationDetailDTO) {
        return await this.locationService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: LocationCreateDTO,  @User() user_id: string) {
        return await this.locationService.update(data, user_id)
    }

    @Get('/sector/combolist/')
    async getSectors() {
        return await this.locationService.getSectors()
    }

    @Get('/combolist/')
    async combolist() {
        return await this.locationService.combolist()
    }

    @Get('/track/')
    async getTrack(@Query() param: TrackDTO) {
        return await this.locationService.getTrack(param)
    }
}
