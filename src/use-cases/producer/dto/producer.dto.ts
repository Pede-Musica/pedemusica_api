import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class ProducerCreateDTO {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    cad_pro: string;

    @IsNotEmpty()
    @IsString()
    ggn: string;
}
