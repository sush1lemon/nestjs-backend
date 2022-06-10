import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    subRedditId: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    content?: string;

    flairs?: Array<any>;
}
