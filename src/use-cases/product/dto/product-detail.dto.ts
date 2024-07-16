import { IsNotEmpty, IsString } from "@nestjs/class-validator";

export class ProductDetailDTO {
    @IsNotEmpty()
    @IsString()
    id: string;
}
