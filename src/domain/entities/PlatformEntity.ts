export class PlatformEntity {
  id: string;
  name: string;
  apiBaseUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    apiBaseUrl: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.name = name;
    this.apiBaseUrl = apiBaseUrl;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
