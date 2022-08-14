import express from 'express';
import { UsersController } from '../controllers/users.controller';
import { validateUser } from '../middleware/dataValidation';

const router = express.Router();

router.route('/').post(validateUser, UsersController.logInUser);

export default router;
