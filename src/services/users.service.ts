import UserModel from '../models/user.model';
import { User } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JwtConfig } from '../config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config = JwtConfig.params;

export class UsersService {
  public static async create(user: User): Promise<User> {
    const encryptedPassword = await bcrypt.hash(user.password, 10);

    await UserModel.create({
      email: user.email.toLowerCase(),
      password: encryptedPassword
    });

    const newUser: User = {
      email: user.email.toLowerCase(),
      password: encryptedPassword
    };

    // Log the new user in by calling the login method with the new user's email and the unhashed password received
    newUser.token = await this.login({ email: newUser.email, password: user.password });

    return newUser;
  }

  public static async findOne(email: string) {
    return UserModel.findOne({ email });
  }

  public static async login(user: User) {
    const privateKey = Buffer.from(<string>process.env.PRIVATE_KEY, 'base64').toString('ascii');

    const foundUser = await this.findOne(user.email);

    if (foundUser) {
      if (await bcrypt.compare(user.password, <string>foundUser.password)) {
        const token = jwt.sign({ user_id: foundUser._id, email: user.email }, privateKey, {
          expiresIn: config.duration,
          algorithm: <jwt.Algorithm>config.encryptAlgorithm
        });
        return token;
      }
    }
    return false;
  }
}
