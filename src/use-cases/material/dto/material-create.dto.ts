import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { isFloat64Array } from 'util/types';

export class MaterialCreateDTO {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty()
    @IsInt()
    in_stock: number;

    @IsNotEmpty()
    @IsInt()
    volume: number;

    @IsNotEmpty()
    @IsString()
    volume_type: string;

    @IsNotEmpty()
    @IsBoolean()
    traceable: boolean;

    @IsNotEmpty()
    @IsString()
    description: string;
}
