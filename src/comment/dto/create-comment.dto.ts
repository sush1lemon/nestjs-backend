import { IsNumber, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    post_id: string;

    user_id?: string;

    @IsString()
    @IsNotEmpty()
    subReddit_id: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    parent_id?: string | null;
}
