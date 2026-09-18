export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly role: string,
    public readonly employeeId?: number,
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
