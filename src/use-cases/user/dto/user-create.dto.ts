import { IsEmail, IsInt, IsNotEmpty, IsString } from '@nestjs/class-validator';

export class UserCreateDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsInt()
    type: number;
}
