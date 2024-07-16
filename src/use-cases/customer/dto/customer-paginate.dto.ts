import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsString } from '@nestjs/class-validator';

export class CustomerPaginateDTO {

    @IsNotEmpty()
    @IsString()
    search: string;

    @IsNotEmpty()
    @IsNumber()
    page: number;

    @IsNotEmpty()
    @IsNumber()
    pageSize: number;

    @IsNotEmpty()
    @IsString()
    order: string;
}
