// Application Layer - Data Transfer Objects
// How data is transferred between layers

export interface UserDTO {
  id: number;
  name: string;
  email: string;
}

export interface UserStatsDTO {
  totalUsers: number;
  sample: UserDTO[];
}

export interface UserListOptionsDTO {
  limit?: number;
}
