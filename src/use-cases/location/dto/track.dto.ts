import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class TrackDTO {

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

    @IsNotEmpty()
    @IsString()
    sector_id: string;
}
