import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { isFloat64Array } from 'util/types';

export class EntryCreateDTO {
    @IsNotEmpty()
    @IsString()
    entry_at: string;

    @IsOptional()
    @IsString()
    field: string;

    @IsOptional()
    @IsString()
    observation: string;

    @IsNotEmpty()
    @IsString()
    producer: any;

    @IsNotEmpty()
    @IsString()
    products: any;
}


