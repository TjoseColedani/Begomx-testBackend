import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();

router.use(authenticateJWT);

router.get('/', getUsers);
router.get('/:id', getUserById);

router.post('/', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest
], createUser);

router.put('/:id', [
    body('email').optional().isEmail().withMessage('Must be a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validateRequest
], updateUser);

router.delete('/:id', deleteUser);

export default router;
