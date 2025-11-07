import { db } from '../database/drizzle';
import { agencies } from '../database/schema';
import { eq } from 'drizzle-orm';
import { AgencyEntity } from '../../domain/entities/AgencyEntity';
import { IAgencyRepository } from '../../domain/repositories/IAgencyRepository';

export class AgencyRepository implements IAgencyRepository {
  async getAgencyByOwnerId(ownerId: string): Promise<AgencyEntity | null> {
    const [row] = await db
      .select()
      .from(agencies)
      .where(eq(agencies.ownerId, ownerId))
      .limit(1);
    if (!row) return null;
    return new AgencyEntity(
      row.id,
      row.name,
      row.ownerId,
      row.createdAt,
      row.updatedAt
    );
  }

  async createAgency(name: string, ownerId: string): Promise<AgencyEntity> {
    const [row] = await db
      .insert(agencies)
      .values({ name, ownerId })
      .returning();
    return new AgencyEntity(
      row.id,
      row.name,
      row.ownerId,
      row.createdAt,
      row.updatedAt
    );
  }
}
