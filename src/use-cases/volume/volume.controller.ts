import { Controller, Get, Param } from '@nestjs/common';
import { VolumeService } from './volume.service';
import { VolumeDetailDTO } from './dto/volume-detail.dto';

@Controller('volume')
export class VolumeController {

    constructor(
        public volumeService: VolumeService
    ) {}

    @Get('/detail/:id')
    async detail(@Param() data: VolumeDetailDTO) {
        return await this.volumeService.detail(data)
    }
}
