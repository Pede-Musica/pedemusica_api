import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class RequestPaginateDTO {
    @IsOptional()
    @IsString()
    filter?: string;

    @IsOptional()
    @IsString()
    favorite?: string;
}
