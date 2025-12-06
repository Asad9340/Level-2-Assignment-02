import { Router } from "express";
import { usersController } from "./users.controller";
import auth from "../../middleware/auth";


const router = Router(); 

router.get('/', auth('admin'),usersController.getAllUsers)
router.put('/:userId', auth('admin','customer'),usersController.updateUser);

export const usersRouter = router;