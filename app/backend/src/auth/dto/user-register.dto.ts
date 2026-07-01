import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

/** First-party user registration (canonical auth). */
export class UserRegisterDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsString() @IsOptional() name?: string;
}
