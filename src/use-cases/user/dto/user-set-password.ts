import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class UserSetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  token: string;
}
