// Application Layer - Data Transfer Objects (DTOs)
// Class-based DTOs with validation decorators (ASP.NET Core style)

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// DTO for creating a new user
export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

// DTO for updating a user
export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

// DTO for user response
export class UserDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}

// DTO for user list options
export class UserListOptionsDTO {
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
