import { IsEmail, IsString, MinLength } from 'class-validator';

/** First-party user login (canonical auth). */
export class UserLoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) password!: string;
}
