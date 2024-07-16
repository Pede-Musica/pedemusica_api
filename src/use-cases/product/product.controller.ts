import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { ProductService } from './product.service';
import { ProductCreateDTO } from './dto/product-create.dto';
import { ProductPaginateDTO } from './dto/product-paginate.dto';
import { ProductDetailDTO } from './dto/product-detail.dto';

@Controller('product')
export class ProductController {

    constructor(
        public readonly productService: ProductService
    ) {}

    @Get('/paginate')
    async paginate(@Query() params: ProductPaginateDTO) {
        return await this.productService.paginate(params)
    }

    @Post('/create')
    async create(@Body() data: ProductCreateDTO,  @User() user_id: string) {
        return await this.productService.create(data, user_id)
    }

    @Get('/detail/:id')
    async detail(@Param() data: ProductDetailDTO) {
        return await this.productService.detail(data)
    }

    @Post('/update')
    async update(@Body() data: ProductCreateDTO,  @User() user_id: string) {
        return await this.productService.update(data, user_id)
    }
}
