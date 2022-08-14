import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';

export class UsersController {
  public static async registerUser(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const email = req.body.email.toLowerCase();

      const oldUser = await UsersService.findOne(email);

      if (oldUser) {
        return res.status(409).json({ message: 'A user with this e-mail address already exists' });
      }

      const user = await UsersService.create({ email, password });

      res.status(201).json({
        message: 'Registration successful',
        email: user.email,
        token: user.token
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public static async logInUser(req: Request, res: Response) {
    try {
      const { password } = req.body;
      const email = req.body.email.toLowerCase();

      if (!(email && password)) {
        res.status(400).json({ message: 'Email and password input is required' });
      }

      const token = await UsersService.login({ email, password });

      if (token) {
        res.status(200).json({
          message: 'Login successful',
          email,
          token
        });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
