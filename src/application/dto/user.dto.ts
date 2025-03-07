import { UserEntity } from '../../domain/entities/user.entity';

export class UserDTO {
  constructor(
    public id: string,
    public username: string,
    public email: string
  ) {}

  static fromEntity(user: UserEntity): UserDTO {
    return new UserDTO(user.id, user.username, user.email);
  }
}
