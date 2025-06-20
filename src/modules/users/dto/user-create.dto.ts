import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class UserCreateDTO {
    @IsOptional()
    @IsString()
    id?: string;

    @IsNotEmpty()
    @IsString()
    user: string;

    @IsNotEmpty()
    @IsBoolean()
    is_active: boolean;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    phone2: string;

    @IsOptional()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    cpf_cnpj: string;

    @IsNotEmpty()
    @IsString()
    userposition: string;
}
