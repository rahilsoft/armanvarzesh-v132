import { IsInt, IsOptional, IsString, Max, Min, Matches } from 'class-validator';
export class ListPaymentsDto {
  @IsOptional() @IsInt() @Min(1) @Max(200) limit?: number;
  @IsOptional() @IsString() @Matches(/^[A-Za-z0-9_-]+=*$/) cursor?: string; // base64url-ish
}
