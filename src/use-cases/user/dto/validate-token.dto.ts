import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class ValidateToken {
  @IsNotEmpty()
  @IsString()
  token: string;
}
