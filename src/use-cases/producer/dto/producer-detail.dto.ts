import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class ProducerDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
