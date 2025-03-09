import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserDTO } from '../dto/user.dto';
import { ENV } from '../../config/env.config';

export class AuthService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ user: UserDTO; token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new Error('User already exists');

    const newUser = await this.userRepository.createUser({
      username,
      email,
      password,
    });

    const token = this.generateToken(newUser);
    return { user: UserDTO.fromEntity(newUser), token };
  }

  async login(
    email: string,
    password: string
  ): Promise<{ user: UserDTO; token: string }> {
    console.log({ email });

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');
    console.log({ user });
    console.log(password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log({ isMatch });

    if (!isMatch) throw new Error('Invalid email or password');

    const token = this.generateToken(user);
    return { user: UserDTO.fromEntity(user), token };
  }

  async getProfile(userId: string): Promise<UserDTO | null> {
    const user = await this.userRepository.findById(userId);
    return user ? UserDTO.fromEntity(user) : null;
  }

  private generateToken(user: UserEntity): string {
    return jwt.sign({ id: user.id, email: user.email }, ENV.JWT_SECRET, {
      expiresIn: '1h',
    });
  }
}
