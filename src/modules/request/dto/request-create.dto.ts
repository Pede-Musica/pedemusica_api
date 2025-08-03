import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from '@nestjs/class-validator';

export class RequestCreateDTO {
    @IsOptional()
    @IsString()
    user_name?: string;

    @IsOptional()
    @IsString()
    table?: string;

    @IsNotEmpty()
    @IsString()
    song_name: string;

    @IsNotEmpty()
    @IsString()
    client_slug: string;
}
