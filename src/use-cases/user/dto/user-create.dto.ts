import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class UserCreateDTO {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;

}
