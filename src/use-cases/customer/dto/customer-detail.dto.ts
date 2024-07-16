import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class CustomerDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
