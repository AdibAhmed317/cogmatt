import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSocialAccountDTO {
  @IsNotEmpty()
  @IsUUID()
  agencyId!: string;

  @IsNotEmpty()
  @IsUUID()
  platformId!: string;

  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  expiresAt?: Date;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  profileUrl?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  accountId?: string;
}

export class SocialAccountResponseDTO {
  id: string;
  agencyId: string;
  platformId: string;
  platformName?: string;
  username: string;
  profileUrl?: string | null;
  profilePicture?: string | null;
  accountId?: string | null;
  isExpired: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    agencyId: string,
    platformId: string,
    username: string,
    isExpired: boolean,
    createdAt: Date,
    updatedAt: Date,
    platformName?: string,
    profileUrl?: string | null,
    profilePicture?: string | null,
    accountId?: string | null
  ) {
    this.id = id;
    this.agencyId = agencyId;
    this.platformId = platformId;
    this.platformName = platformName;
    this.username = username;
    this.profileUrl = profileUrl;
    this.profilePicture = profilePicture;
    this.accountId = accountId;
    this.isExpired = isExpired;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class FacebookCallbackDTO {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  state!: string;
}
