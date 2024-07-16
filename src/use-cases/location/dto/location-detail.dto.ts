import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class LocationDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
