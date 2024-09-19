import { IsNotEmpty, IsString } from "class-validator";
import { KeywordEntity } from "../../entities/keyword.entity";

export class KeywordDTO {
    @IsString()
    @IsNotEmpty()
    name: KeywordEntity['name'];
}