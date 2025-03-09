import mongoose from 'mongoose';
import { IUserRepository } from '../../../application/interfaces/user-repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserModel, IUserDocument } from '../models/user.model';

export class UserRepository implements IUserRepository {
  private toEntity(userDoc: IUserDocument): UserEntity {
    return new UserEntity(
      userDoc._id.toString(),
      userDoc.username,
      userDoc.email,
      userDoc.password,
      userDoc.favorites.map((fav) => fav.toString())
    );
  }

  async createUser(userData: Partial<UserEntity>): Promise<UserEntity> {
    const userToSave = {
      ...userData,
      favorites: userData.favorites?.map(
        (fav) => new mongoose.Types.ObjectId(fav)
      ), // ✅ Convert string[] to ObjectId[]
    };

    const user = new UserModel(userToSave);
    const savedUser = await user.save();
    return this.toEntity(savedUser);
  }

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await UserModel.findById(userId);
    return user ? this.toEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }
  async updateUser(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await UserModel.findByIdAndUpdate(user.id, user, {
      new: true,
    });
    if (!updatedUser) throw new Error('User not found');
    return this.toEntity(updatedUser);
  }
}
