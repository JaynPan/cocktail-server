import { IsEmail, IsString, IsOptional } from 'class-validator';

export class AppleOAuthDto {
  @IsString()
  identityToken: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;
}
