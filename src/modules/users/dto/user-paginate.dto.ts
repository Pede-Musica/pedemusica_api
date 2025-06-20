import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class UserPaginateDTO {
    @IsOptional()
    @IsString()
    search: string = '';

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    page: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    pageSize: number;

    @IsNotEmpty()
    @IsString()
    order: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    active: boolean;
}
