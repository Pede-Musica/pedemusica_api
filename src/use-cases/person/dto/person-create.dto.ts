import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class PersonCreateDTO {
    @IsOptional()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    position: string;

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
    @IsNumber()
    type: number

    @IsNotEmpty()
    @IsString()
    cpf_cnpj: string;

    @IsNotEmpty()
    @IsBoolean()
    isCustomer: boolean

    @IsNotEmpty()
    @IsBoolean()
    isProducer: boolean

    @IsNotEmpty()
    @IsBoolean()
    isUser: boolean

    @IsNotEmpty()
    @IsBoolean()
    sysAdmin: boolean
}
