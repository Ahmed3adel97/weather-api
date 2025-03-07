export class UserEntity {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password: string,
    public favorites: string[] = []
  ) {}

  async comparePassword(
    candidatePassword: string,
    hashFunction: (password: string, hashed: string) => Promise<boolean>
  ): Promise<boolean> {
    return await hashFunction(candidatePassword, this.password);
  }
}
