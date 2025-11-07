import { Hono, Context } from 'hono';
import { AgencyService } from '../../application/services/AgencyService';
import { AgencyRepository } from '../../infrastructure/repositories/AgencyRepository';

// NOTE: For simplicity we accept ownerId as a query parameter. In production,
// replace this with proper JWT verification to derive ownerId from the access token.

export class AgencyController {
  public router = new Hono();
  private agencyService: AgencyService;

  constructor() {
    const agencyRepository = new AgencyRepository();
    this.agencyService = new AgencyService(agencyRepository);
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get('/me', (c) => this.getOrCreateForCurrentUser(c));
  }

  async getOrCreateForCurrentUser(c: Context) {
    try {
      const ownerId = c.req.query('ownerId');
      if (!ownerId) {
        return c.json({ error: 'ownerId query param required' }, 400);
      }
      const agency =
        await this.agencyService.getOrCreateAgencyForOwner(ownerId);
      return c.json({ agencyId: agency.id, name: agency.name });
    } catch (error) {
      console.error('Failed to get/create agency:', error);
      return c.json({ error: 'Failed to resolve agency' }, 500);
    }
  }
}
