import express, { NextFunction, Request, Response } from 'express';
import usersRoutes from './routes/users.router';
import authRoutes from './routes/auth.router';
import mongoSanitize from 'express-mongo-sanitize';
import logger from './middleware/logger';

const app = express();

app.use(mongoSanitize());
app.use(express.json());

app.use(logger('file'));
if (<string>process.env.NODE_ENV === 'production') {
  app.use(logger('console'));
} else {
  app.use(logger('dev'));
}

// API Routes
app.use('/token', authRoutes);
app.use('/', usersRoutes);

// Error handling
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Incorrect API path (auth)' });
});

// Default error
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.message) {
    err.message = 'Something went wrong';
  }
  if (!err.status) {
    err.statusCode = 500;
  }
  res.status(err.statusCode).json(`${err.message}`);
});

export default app;
