import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class SectorDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
