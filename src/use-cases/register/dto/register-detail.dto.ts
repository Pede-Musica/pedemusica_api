import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class RegisterDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
