import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class FindUserByIdDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
