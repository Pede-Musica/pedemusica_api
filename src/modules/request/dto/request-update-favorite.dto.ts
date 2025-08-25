import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';
import { IsNumber, IsNumberString } from 'class-validator';

export class RequestUpdateFavoriteDTO {
    
    @IsNumber()
    id: any;

    @IsString()
    change: string;
    
}
