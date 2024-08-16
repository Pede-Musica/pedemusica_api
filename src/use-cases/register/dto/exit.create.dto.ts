import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';
import { isFloat64Array } from 'util/types';

export class ExitCreateDTO {
    @IsNotEmpty()
    @IsString()
    exit_at: string;

    @IsOptional()
    @IsString()
    observation: string;

    @IsNotEmpty()
    @IsString()
    customer: any;

    @IsNotEmpty()
    @IsString()
    exit_type: any;

    @IsOptional()
    @IsString()
    invoice: string;
}


