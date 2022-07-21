import { IsEmail, IsString, IsOptional } from 'class-validator';

// except accessToken, the others fields is fetched by provided token, please see googleOAuth.guard.ts file
export class GoogleOAuthDto {
  @IsString()
  accessToken: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  picture: string;

  @IsString()
  @IsOptional()
  name: string;
}

export type GoogleUserInfoDto = {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
  locale: string;
  name: string;
  picture: string;
  verified_email: boolean;
};
