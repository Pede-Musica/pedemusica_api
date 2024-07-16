import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class MaterialDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
