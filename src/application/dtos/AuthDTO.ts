// Application Layer - Auth DTOs
// Data Transfer Objects with validation

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// DTO for user registration
export class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

// DTO for user login
export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

// DTO for token refresh
export class RefreshTokenDTO {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

// DTO for auth response
export class AuthResponseDTO {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
