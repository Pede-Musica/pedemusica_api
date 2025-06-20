import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
} from '@nestjs/class-validator';

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    position: string;

    @IsNotEmpty()
    @IsDateString()
    created_at: Date;

    @IsNotEmpty()
    @IsDateString()
    updated_at: Date;
}
