import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerPaginateDTO } from './dto/customer-paginate.dto';
import { User } from 'src/decorators/user.decorator';
import { CustomerCreateDTO } from './dto/customer-create.dto';
import { CustomerDetailDTO } from './dto/customer-detail.dto';

@Controller('customer')
export class CustomerController {

    constructor(
        public readonly customerService: CustomerService
    ) {}

    @Get('/paginate')
    async paginate(@Query() params: CustomerPaginateDTO) {
        return await this.customerService.paginate(params)
    }

    @Post('/create')
    async create(@Body() data: CustomerCreateDTO,  @User() user_id: string) {
        return await this.customerService.create(data, user_id)
    }

    @Get('/detail/:id')
    async detail(@Param() data: CustomerDetailDTO) {
        return await this.customerService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: CustomerCreateDTO,  @User() user_id: string) {
        return await this.customerService.update(data, user_id)
    }
}
