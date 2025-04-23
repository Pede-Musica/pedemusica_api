import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class UserPaginateDTO {

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

    @IsOptional()
    @IsBoolean()
    active: boolean;
}
