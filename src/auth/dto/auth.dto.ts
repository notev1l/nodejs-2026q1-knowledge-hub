import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AuthDTO {
    @ApiProperty({
        description: 'User login',
        example: 'johndoe',
        type: String,
    })
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        description: 'User password',
        example: 'abc123',
        type: String,
    })
    @IsNotEmpty()
    password: string;
}