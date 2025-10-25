export class PlatformResponseDTO {
  id: string;
  name: string;
  apiBaseUrl: string;

  constructor(id: string, name: string, apiBaseUrl: string) {
    this.id = id;
    this.name = name;
    this.apiBaseUrl = apiBaseUrl;
  }
}
