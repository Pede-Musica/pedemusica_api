import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString } from "@nestjs/class-validator";

export class VolumeTransformDTO {
    @IsNotEmpty()
    @IsObject()
    current_volume: any;

    @IsNotEmpty()
    @IsArray()
    new_volumes: Array<any>;

    @IsNotEmpty()
    @IsNumber()
    remaining: number;

    @IsNotEmpty()
    @IsNumber()
    drawn: number;

    @IsNotEmpty()
    @IsNumber()
    drawn_amount: number;

    @IsNotEmpty()
    @IsString()
    updated_at: string;

    @IsNotEmpty()
    @IsString()
    movimentation_type: string;
}
