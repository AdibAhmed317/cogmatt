export class AgencyEntity {
  constructor(
    public id: string,
    public name: string,
    public ownerId: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
