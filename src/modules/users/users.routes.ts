import { Router } from 'express';
import { usersController } from './users.controller';
import auth from '../../middleware/auth';

const router = Router();

router.get('/', auth('admin'), usersController.getAllUsers);
router.put('/:userId', auth('admin', 'customer'), usersController.updateUser);
router.delete('/:userId', auth('admin'), usersController.deleteUser);

export const usersRouter = router;
