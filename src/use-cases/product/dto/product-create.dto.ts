import { IsArray, IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class ProductCreateDTO {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsArray()
    types: Array<{ name: string, isActive: boolean }>;

    @IsOptional()
    @IsArray()
    sizes:  Array<{ name: string, isActive: boolean }>;
}
