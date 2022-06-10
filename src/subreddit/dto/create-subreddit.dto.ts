import { IsNotEmpty, IsString, IsIn } from "class-validator";

export class CreateSubredditDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    description: '';

    @IsNotEmpty()
    @IsIn(['public', 'restricted', 'private'])
    type: 'public' | 'restricted' | 'private';

    @IsNotEmpty()
    nsfw: boolean;
}
