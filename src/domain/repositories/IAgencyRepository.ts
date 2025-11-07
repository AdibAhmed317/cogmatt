import { AgencyEntity } from '../entities/AgencyEntity';

export interface IAgencyRepository {
  getAgencyByOwnerId(ownerId: string): Promise<AgencyEntity | null>;
  createAgency(name: string, ownerId: string): Promise<AgencyEntity>;
}
