import { UserEntity } from '../../domain/entities/user.entity';

export interface IUserRepository {
  createUser(userData: Partial<UserEntity>): Promise<UserEntity>;
  findById(userId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  updateUser(user: UserEntity): Promise<UserEntity>;
}
