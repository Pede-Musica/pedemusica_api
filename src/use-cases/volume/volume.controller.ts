import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { VolumeService } from './volume.service';
import { VolumeDetailDTO } from './dto/volume-detail.dto';
import { User } from 'src/decorators/user.decorator';
import { VolumeTransformDTO } from './dto/volume-transform.dto';

@Controller('volume')
export class VolumeController {

    constructor(
        public volumeService: VolumeService
    ) {}

    @Get('/detail/:id')
    async detail(@Param() data: VolumeDetailDTO) {
        return await this.volumeService.detail(data)
    }

    @Post('/transform')
    async create(@Body() data: VolumeTransformDTO,  @User() user_id: string) {
        return await this.volumeService.transform(data, user_id)
    }

    @Post('/return')
    async returnVolume(@Body() data: { volume_id: string, location_id: string },  @User() user_id: string) {
        return await this.volumeService.returnVolume(data, user_id)
    }

    @Delete('/delete/:id')
    async delete(@Param() data: { id: string }) {
        return await this.volumeService.delete(data.id)
    }
}
