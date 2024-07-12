import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class AuthDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
