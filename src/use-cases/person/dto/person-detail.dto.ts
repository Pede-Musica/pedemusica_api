
import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class PersonDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
