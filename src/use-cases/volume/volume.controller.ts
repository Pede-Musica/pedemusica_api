import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
