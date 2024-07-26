/* import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProducerCreateDTO } from './dto/producer.dto';
import { User } from 'src/decorators/user.decorator';
import { ProducerService } from './producer.service';
import { ProducerPaginateDTO } from './dto/producer-paginate.dto';
import { ProducerDetailDTO } from './dto/producer-detail.dto';

@Controller('producer')
export class ProducerController {

    constructor(
        public readonly producerService: ProducerService
    ) {}

    @Post('/create')
    async create(@Body() data: ProducerCreateDTO,  @User() user_id: string) {
        return await this.producerService.create(data, user_id)
    }

    @Get('/paginate')
    async paginate(@Query() params: ProducerPaginateDTO) {
        return await this.producerService.paginate(params)
    }

    @Get('/detail/:id')
    async detail(@Param() data: ProducerDetailDTO) {
        return await this.producerService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: ProducerCreateDTO,  @User() user_id: string) {
        return await this.producerService.update(data, user_id)
    }
}
 */