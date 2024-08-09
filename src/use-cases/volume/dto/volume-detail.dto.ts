import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class VolumeDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
