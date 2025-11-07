import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';
import { AgencyEntity } from '../../domain/entities/AgencyEntity';

export class AgencyService {
  constructor(private agencyRepository: IAgencyRepository) {}

  async getOrCreateAgencyForOwner(ownerId: string): Promise<AgencyEntity> {
    let agency = await this.agencyRepository.getAgencyByOwnerId(ownerId);
    if (!agency) {
      // Default agency name could be refined later
      agency = await this.agencyRepository.createAgency('My Agency', ownerId);
    }
    return agency;
  }
}
